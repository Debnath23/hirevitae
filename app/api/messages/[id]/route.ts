// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const senderId = Number.parseInt(session.user.id);

//     if (isNaN(senderId)) {
//       return NextResponse.json(
//         { message: "Invalid sender ID" },
//         { status: 400 }
//       );
//     }

//     const recipientId = Number.parseInt(params.id);

//     if (isNaN(recipientId)) {
//       return NextResponse.json(
//         { message: "Invalid recipient ID" },
//         { status: 400 }
//       );
//     }

//     const messages = await prisma.message.findMany({
//       where: {
//         OR: [
//           { senderId: senderId, receiverId: recipientId },
//           { senderId: recipientId, receiverId: senderId },
//         ],
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         receiver: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error("Get messages error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const senderId = Number.parseInt(session.user.id)

    if (isNaN(senderId)) {
      return NextResponse.json({ message: "Invalid sender ID" }, { status: 400 })
    }

    const recipientId = Number.parseInt(params.id)

    if (isNaN(recipientId)) {
      return NextResponse.json({ message: "Invalid recipient ID" }, { status: 400 })
    }

    // Get all messages between the two users
    // Both regular messages and reply messages are stored in the Message table
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
        // Include reactions (emoji only) for each message
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
    })

    // Process messages to add reply information
    // For reply messages, we need to fetch the original message they're replying to
    const processedMessages = await Promise.all(
      messages.map(async (message) => {
        // Group reactions by emoji for easier display
        const groupedReactions = message.reactions.reduce((acc, reaction) => {
          const key = reaction.emojiNative
          if (!acc[key]) {
            acc[key] = {
              emoji: {
                id: reaction.emojiId,
                native: reaction.emojiNative,
                name: reaction.emojiName,
              },
              count: 0,
              users: [],
            }
          }
          acc[key].count++
          acc[key].users.push({
            id: reaction.user.id,
            name: reaction.user.name,
          })
          return acc
        }, {})

        const formattedReactions = Object.values(groupedReactions)

        // Check if message has metadata with reply information
        // Reply messages are regular messages with metadata pointing to the original message
        if (message.metadata) {
          try {
            const metadata = JSON.parse(message.metadata as string)

            if (metadata.replyToId) {
              // Find the original message in the Message table
              const originalMessage = await prisma.message.findUnique({
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
              })

              if (originalMessage) {
                return {
                  ...message,
                  reactions: formattedReactions,
                  replyToId: metadata.replyToId,
                  replyToMessage: originalMessage,
                  quote: {
                    text: originalMessage.text || "",
                    avatar: originalMessage.sender.avatar || "/placeholder.svg",
                    parts: originalMessage.sender.name,
                  },
                }
              }
            }
          } catch (e) {
            console.error("Error parsing message metadata:", e)
          }
        }

        return {
          ...message,
          reactions: formattedReactions,
        }
      }),
    )

    return NextResponse.json(processedMessages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
