import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { uploadToS3 } from "@/lib/aws"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const receiverId = Number.parseInt(params.id)

    if (isNaN(receiverId)) {
      return NextResponse.json({ message: "Invalid receiver ID" }, { status: 400 })
    }

    const formData = await request.formData()
    const text = formData.get("text") as string
    const emojiCodes = formData.get("emojiCodes") as string
    const file = formData.get("file") as File
    const replyToMessageId = formData.get("replyToMessageId") as string

    if (!text && !file && !emojiCodes) {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 })
    }

    let fileUrl: string | null = null
    let fileType: string | null = null
    let fileSize: number | null = null
    let fileName: string | null = null

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      fileUrl = await uploadToS3(buffer, file.name, file.type)
      fileType = file.type
      fileSize = file.size
      fileName = file.name
    }

    const message = await prisma.message.create({
      data: {
        text: text || null,
        emojiCodes: emojiCodes ? JSON.parse(emojiCodes) : null,
        fileUrl,
        fileType,
        fileSize,
        fileName,
        senderId: user.id,
        receiverId,
        replyToMessageId: replyToMessageId ? Number.parseInt(replyToMessageId) : null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        replyToMessage: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            emoji: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
