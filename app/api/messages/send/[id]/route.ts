import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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

    const senderId = Number.parseInt(session?.user?.id);
    const receiverId = Number.parseInt(params.id);

    if (isNaN(receiverId)) {
      return NextResponse.json(
        { message: "Invalid receiver ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, formatting, selectedUser } = body;

    const messageData = {
      text: content,
      bold: formatting.bold || false,
      italic: formatting.italic || false,
      underline: formatting.underline || false,
      unorderedList: formatting.unorderedList || false,
      orderedList: formatting.orderedList || false,
      fontSize: formatting.fontSize || "14",
      linkTitle: formatting.linkTitle || null,
      linkTarget: formatting.linkTarget || null,
      emoji: formatting.emoji || null,
      imageUrl: formatting.imageUrl || null,
      codeLanguage: formatting.codeLanguage || null,
      codeContent: formatting.codeContent || null,
      receiverId: selectedUser.id,
      senderId: senderId,
    };

    const message = await prisma.message.create({
      data: messageData,
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
