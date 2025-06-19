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
    const { messageId, emoji } = await request.json();

    if (
      isNaN(receiverId) ||
      isNaN(senderId) ||
      !messageId ||
      !emoji?.id ||
      !emoji?.native ||
      !emoji?.name
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const messageIdNum = Number(messageId);
    if (isNaN(messageIdNum)) {
      return NextResponse.json(
        { message: "Invalid message ID" },
        { status: 400 }
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: messageIdNum },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    let reaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageIdNum,
        userId: senderId,
        emojiId: emoji.id,
      },
    });

    if (reaction) {
      reaction = await prisma.reaction.update({
        where: { id: reaction.id },
        data: {
          count: { increment: 1 },
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
      });
    } else {
      reaction = await prisma.reaction.create({
        data: {
          messageId: messageIdNum,
          userId: senderId,
          emojiId: emoji.id,
          emojiNative: emoji.native,
          emojiName: emoji.name,
          count: 1,
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
      });
    }

    const receiverSocketId = getReceiverSocketId(String(receiverId));
    const senderSocketId = getReceiverSocketId(String(senderId));

    console.log("senderSocketId", senderSocketId);
      console.log("receiverSocketId", receiverSocketId);

    if (receiverSocketId || senderSocketId) {
      console.log("📤 Emitting socket reaction");
      io.to(receiverSocketId).to(senderSocketId).emit("reaction", reaction);
    }

    return NextResponse.json(reaction, { status: 201 });
  } catch (error) {
    console.error("Add reaction error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
