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

    const currentUserId = Number(session.user.id);
    const senderId = Number(params.id);

    if (isNaN(senderId)) {
      return NextResponse.json(
        { message: "Invalid sender ID" },
        { status: 400 }
      );
    }

    const updatedMessages = await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: currentUserId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    const senderSocketId = getReceiverSocketId(String(senderId));
    const currentUserSocketId = getReceiverSocketId(String(currentUserId));

    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", {
        receiverId: currentUserId,
        readAt: new Date().toISOString(),
      });
    }

    if (currentUserSocketId) {
      io.to(currentUserSocketId).emit("messagesRead", {
        senderId: senderId,
        readAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        count: updatedMessages.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark messages as read error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
