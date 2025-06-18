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

    const { messageId, emoji } = await request.json();

    if (!messageId || !emoji) {
      return NextResponse.json(
        { message: "Message ID and emoji are required" },
        { status: 400 }
      );
    }

    if (!emoji.id || !emoji.native || !emoji.name) {
      return NextResponse.json(
        { message: "Invalid emoji data" },
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

    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageIdNum,
        userId: senderId,
        emojiId: emoji.id,
      },
    });

    if (existingReaction) {
      return NextResponse.json(
        { message: "Reaction already exists" },
        { status: 400 }
      );
    }

    const reaction = await prisma.reaction.create({
      data: {
        messageId: messageIdNum,
        userId: senderId,
        emojiId: emoji.id,
        emojiNative: emoji.native,
        emojiName: emoji.name,
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

    const receiverSocketId = getReceiverSocketId(String(receiverId));
    const senderSocketId = getReceiverSocketId(String(senderId));

    if (receiverSocketId || senderSocketId) {
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

// export async function DELETE(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const userId = Number(session.user.id);
//     const { messageId, emojiId } = await request.json();

//     if (!messageId || !emojiId) {
//       return NextResponse.json(
//         { message: "Message ID and emoji ID are required" },
//         { status: 400 }
//       );
//     }

//     const messageIdNum = Number(messageId);
//     if (isNaN(messageIdNum)) {
//       return NextResponse.json(
//         { message: "Invalid message ID" },
//         { status: 400 }
//       );
//     }

//     // Find the specific reaction to delete
//     const reaction = await prisma.reaction.findFirst({
//       where: {
//         messageId: messageIdNum,
//         userId: userId,
//         emojiId: emojiId,
//       },
//     });

//     if (!reaction) {
//       return NextResponse.json(
//         { message: "Reaction not found" },
//         { status: 404 }
//       );
//     }

//     // Delete the reaction
//     await prisma.reaction.delete({
//       where: {
//         id: reaction.id,
//       },
//     });

//     return NextResponse.json({ message: "Reaction removed successfully" });
//   } catch (error) {
//     console.error("Remove reaction error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
