// import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const users = await prisma.user.findMany({
//       where: {
//         id: { not: Number.parseInt(session.user.id) },
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("Get users error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

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

    // Get all users except current user
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

    // For each user, get the last message between current user and that user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              // Messages where current user is sender and this user is receiver
              {
                senderId: currentUserId,
                receiverId: user.id,
              },
              // Messages where current user is receiver and this user is sender
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
            seen: true,
            senderId: true,
          },
        });

        return {
          ...user,
          lastMessage: lastMessage?.text,
          lastMessageTime: lastMessage?.createdAt,
          lastMessageSeen: lastMessage?.seen,
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