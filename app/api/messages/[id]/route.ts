import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const senderId = Number.parseInt(session.user.id);

    if (isNaN(senderId)) {
      return NextResponse.json(
        { message: "Invalid sender ID" },
        { status: 400 }
      );
    }

    const recipientId = Number.parseInt(params.id);

    if (isNaN(recipientId)) {
      return NextResponse.json(
        { message: "Invalid recipient ID" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: recipientId },
          { senderId: recipientId, receiverId: senderId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
