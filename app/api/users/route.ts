import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = Number.parseInt(session.user.id);

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        avatar: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: currentUserId,
                receiverId: user.id,
              },
              {
                senderId: user.id,
                receiverId: currentUserId,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            text: true,
            createdAt: true,
            senderId: true,
          },
        });

        return {
          ...user,
          lastMessage: lastMessage?.text,
          lastMessageTime: lastMessage?.createdAt,
          lastMessageSenderId: lastMessage?.senderId,
        };
      })
    );

    return NextResponse.json(usersWithLastMessage);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
