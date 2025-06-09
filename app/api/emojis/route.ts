import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const emojis = await prisma.emoji.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })

    return NextResponse.json(emojis)
  } catch (error) {
    console.error("Get emojis error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { unicode, hashedCode, name, category } = await request.json()

    if (!unicode || !hashedCode || !name || !category) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const emoji = await prisma.emoji.create({
      data: {
        unicode,
        hashedCode,
        name,
        category,
      },
    })

    return NextResponse.json(emoji, { status: 201 })
  } catch (error) {
    console.error("Create emoji error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
