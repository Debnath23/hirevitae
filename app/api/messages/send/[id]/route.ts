import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
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

    const messageData = {
      text: body.content,
      bold: body.formatting?.bold || false,
      italic: body.formatting?.italic || false,
      underline: body.formatting?.underline || false,
      unorderedList: body.formatting?.unorderedList || false,
      orderedList: body.formatting?.orderedList || false,
      fontSize: body.formatting?.fontSize || "14",
      linkTitle: body.formatting?.linkTitle || null,
      linkTarget: body.formatting?.linkTarget || null,
      emoji: body.formatting?.emoji || null,
      imageName: body.formatting?.imageName || null,
      imageUrl: body.formatting?.imageUrl || null,
      codeLanguage: body.formatting?.codeLanguage || null,
      codeContent: body.formatting?.codeContent || null,
      receiverId: receiverId,
      senderId: senderId,
    };

    const message = await prisma.message.create({
      data: messageData,
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
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
