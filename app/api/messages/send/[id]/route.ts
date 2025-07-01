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
      text: object;
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
      linkTitle: body?.linkTitle || null,
      linkTarget: body?.linkTarget || null,
      emoji: body?.emoji || null,
      imageName: body?.imageName || null,
      imageUrl: body?.imageUrl || null,
      codeLanguage: body?.codeLanguage || null,
      codeContent: body?.codeContent || null,
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
            avatar: originalMessage.sender.avatar || null,
            parts: originalMessage.sender.name,
          },
        };
      }
    }

    const receiverSocketId = getReceiverSocketId(String(receiverId));
    const senderSocketId = getReceiverSocketId(String(senderId));

    if (receiverSocketId || senderSocketId) {
      io.to(receiverSocketId)
        .to(senderSocketId)
        .emit("newMessage", responseMessage);
    }

    return NextResponse.json(responseMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
