import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { messageId, emoji } = await request.json()

    if (!messageId || !emoji) {
      return NextResponse.json({ message: "Message ID and emoji are required" }, { status: 400 })
    }

    // Validate emoji object structure
    if (!emoji.id || !emoji.native || !emoji.name) {
      return NextResponse.json({ message: "Invalid emoji data" }, { status: 400 })
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        messageId_userId_emojiId: {
          messageId,
          userId: user.id,
          emojiId: emoji.id,
        },
      },
    })

    if (existingReaction) {
      return NextResponse.json({ message: "Reaction already exists" }, { status: 400 })
    }

    const reaction = await prisma.reaction.create({
      data: {
        messageId,
        userId: user.id,
        emojiId: emoji.id,
        emojiNative: emoji.native,
        emojiName: emoji.name,
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
      },
    })

    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    console.error("Add reaction error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { messageId, emojiId } = await request.json()

    if (!messageId || !emojiId) {
      return NextResponse.json({ message: "Message ID and emoji ID are required" }, { status: 400 })
    }

    const reaction = await prisma.reaction.findUnique({
      where: {
        messageId_userId_emojiId: {
          messageId,
          userId: user.id,
          emojiId,
        },
      },
    })

    if (!reaction) {
      return NextResponse.json({ message: "Reaction not found" }, { status: 404 })
    }

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
