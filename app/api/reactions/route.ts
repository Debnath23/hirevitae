import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number(session.user.id)
    const { messageId, emoji } = await request.json()

    if (!messageId || !emoji) {
      return NextResponse.json({ message: "Message ID and emoji are required" }, { status: 400 })
    }

    // Validate emoji object structure - reactions are emoji only
    if (!emoji.id || !emoji.native || !emoji.name) {
      return NextResponse.json({ message: "Invalid emoji data" }, { status: 400 })
    }

    const messageIdNum = Number(messageId)
    if (isNaN(messageIdNum)) {
      return NextResponse.json({ message: "Invalid message ID" }, { status: 400 })
    }

    // Check if the message exists (can be a regular message or a reply message)
    const message = await prisma.message.findUnique({
      where: { id: messageIdNum },
    })

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageIdNum,
        userId: userId,
        emojiId: emoji.id,
      },
    })

    if (existingReaction) {
      return NextResponse.json({ message: "Reaction already exists" }, { status: 400 })
    }

    // Create a new reaction with emoji information
    const reaction = await prisma.reaction.create({
      data: {
        messageId: messageIdNum,
        userId: userId,
        emojiId: emoji.id,
        emojiNative: emoji.native, // The actual emoji character
        emojiName: emoji.name,     // Name of the emoji
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        message: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    })

    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    console.error("Add reaction error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number(session.user.id)
    const { messageId, emojiId } = await request.json()

    if (!messageId || !emojiId) {
      return NextResponse.json({ message: "Message ID and emoji ID are required" }, { status: 400 })
    }

    const messageIdNum = Number(messageId)
    if (isNaN(messageIdNum)) {
      return NextResponse.json({ message: "Invalid message ID" }, { status: 400 })
    }

    // Find the specific reaction to delete
    const reaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageIdNum,
        userId: userId,
        emojiId: emojiId,
      },
    })

    if (!reaction) {
      return NextResponse.json({ message: "Reaction not found" }, { status: 404 })
    }

    // Delete the reaction
    await prisma.reaction.delete({
      where: {
        id: reaction.id,
      },
    })

    return NextResponse.json({ message: "Reaction removed successfully" })
  } catch (error) {
    console.error("Remove reaction error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
