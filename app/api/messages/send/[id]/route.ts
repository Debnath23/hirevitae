import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getReceiverSocketId, io } from "@/server/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const senderId = Number(session.user.id);
    const receiverId = Number(params.id);

    if (isNaN(receiverId)) {
      return NextResponse.json(
        { message: "Invalid receiver ID" },
        { status: 400 }
      );
    }

    if (isNaN(senderId)) {
      return NextResponse.json(
        { message: "Invalid sender ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const messageData: {
      text: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      unorderedList: boolean;
      orderedList: boolean;
      fontSize: string;
      linkTitle: string | null;
      linkTarget: string | null;
      emoji: string | null;
      imageName: string | null;
      imageUrl: string | null;
      codeLanguage: string | null;
      codeContent: string | null;
      receiverId: number;
      senderId: number;
      metadata?: string;
    } = {
      text: body.content,
      bold: body.formatting?.bold || false,
      italic: body.formatting?.italic || false,
      underline: body.formatting?.underline || false,
      unorderedList: body.formatting?.unorderedList || false,
      orderedList: body.formatting?.orderedList || false,
      fontSize: body.formatting?.fontSize || "14",
      linkTitle: body.formatting?.linkTitle || null,
      linkTarget: body.formatting?.linkTarget || null,
      emoji: body.formatting?.emoji || null,
      imageName: body.formatting?.imageName || null,
      imageUrl: body.formatting?.imageUrl || null,
      codeLanguage: body.formatting?.codeLanguage || null,
      codeContent: body.formatting?.codeContent || null,
      receiverId,
      senderId,
    };

    if (body.replyToId) {
      messageData.metadata = JSON.stringify({
        replyToId: body.replyToId,
        replyToSenderId: body.replyToSenderId,
        replyToContent: body.replyToContent,
      });
    }

    const message = await prisma.message.create({
      data: messageData,
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
      },
    });

    let responseMessage: any = message;

    if (body.replyToId) {
      const originalMessage = await prisma.message.findUnique({
        where: { id: Number(body.replyToId) },
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
      });

      if (originalMessage) {
        responseMessage = {
          ...message,
          replyToId: body.replyToId,
          replyToMessage: originalMessage,
          quote: {
            text: originalMessage.text || "",
            avatar: originalMessage.sender.avatar || "/placeholder.svg",
            parts: originalMessage.sender.name,
          },
        };
      }
    }

    // Get both socket IDs
    const receiverSocketId = getReceiverSocketId(String(receiverId));
    const senderSocketId = getReceiverSocketId(String(senderId));

    // Emit to both parties if they're connected
    if (receiverSocketId || senderSocketId) {
      io.to(receiverSocketId)
        .to(senderSocketId)
        .emit("newMessage", responseMessage);
    }

    return NextResponse.json(responseMessage, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
