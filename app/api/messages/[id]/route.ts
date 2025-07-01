import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface GroupedReaction {
  emoji: {
    id: string | null;
    native: string;
    name: string | null;
  };
  count: number;
  users: Array<{
    id: number;
    name: string | null;
  }>;
}

interface User {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

interface Message {
  id: number;
  text: string | null;
  createdAt: Date;
  senderId: number;
  receiverId: number;
  metadata: string | null;
  sender: User;
  receiver: User;
  reactions: Array<{
    id: number;
    emojiId: string | null;
    emojiNative: string;
    emojiName: string | null;
    userId: number;
    user: {
      id: number;
      name: string | null;
    };
  }>;
}

interface ProcessedMessage extends Omit<Message, "reactions"> {
  reactions: GroupedReaction[];
  replyToId?: number;
  replyToMessage?: Message;
  quote?: {
    text: string;
    avatar: string | null;
    parts: string | null;
  };
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = await Promise.resolve(context);
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

    const messages = (await prisma.message.findMany({
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
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })) as Message[];

    const processedMessages = await Promise.all(
      messages.map(async (message): Promise<ProcessedMessage> => {
        const groupedReactions = message.reactions.reduce<
          Record<string, GroupedReaction>
        >((acc, reaction) => {
          const key = reaction.emojiNative;
          if (!acc[key]) {
            acc[key] = {
              emoji: {
                id: reaction.emojiId,
                native: reaction.emojiNative,
                name: reaction.emojiName,
              },
              count: 0,
              users: [],
            };
          }
          acc[key].count++;
          acc[key].users.push({
            id: reaction.user.id,
            name: reaction.user.name,
          });
          return acc;
        }, {});

        const formattedReactions = Object.values(groupedReactions);

        if (message.metadata) {
          try {
            const metadata = JSON.parse(message.metadata);
            if (metadata.replyToId) {
              const originalMessage = (await prisma.message.findUnique({
                where: { id: metadata.replyToId },
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
              })) as Message | null;

              if (originalMessage) {
                return {
                  ...message,
                  reactions: formattedReactions,
                  replyToId: metadata.replyToId,
                  replyToMessage: originalMessage,
                  quote: {
                    text: originalMessage.text || "",
                    avatar: originalMessage.sender.avatar || null,
                    parts: originalMessage.sender.name,
                  },
                };
              }
            }
          } catch (e) {
            console.error("Error parsing message metadata:", e);
          }
        }

        return {
          ...message,
          reactions: formattedReactions,
        };
      })
    );

    return NextResponse.json(processedMessages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
