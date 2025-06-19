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
        const [lastMessage, unreadMessages] = await Promise.all([
          prisma.message.findFirst({
            where: {
              OR: [
                { senderId: currentUserId, receiverId: user.id },
                { senderId: user.id, receiverId: currentUserId },
              ],
            },
            orderBy: { createdAt: "desc" },
            select: {
              text: true,
              createdAt: true,
              senderId: true,
              read: true,
            },
          }),
          prisma.message.findMany({
            where: {
              senderId: user.id,
              receiverId: currentUserId,
              read: false,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              text: true,
              createdAt: true,
            },
          }),
        ]);

        const hasUnread = unreadMessages.length > 0;
        const lastUnread = hasUnread ? unreadMessages[0] : null;

        return {
          ...user,
          lastMessage: hasUnread ? lastUnread?.text : lastMessage?.text ?? null,
          lastMessageTime: hasUnread
            ? lastUnread?.createdAt
            : lastMessage?.createdAt ?? null,
          lastMessageSenderId: lastMessage?.senderId,
          lastMessageSeen:
            lastMessage?.senderId === currentUserId ? lastMessage?.read : null,
          unreadCount: hasUnread
            ? await prisma.message.count({
                where: {
                  senderId: user.id,
                  receiverId: currentUserId,
                  read: false,
                },
              })
            : 0,
        };
      })
    );

    return NextResponse.json(usersWithLastMessage);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
