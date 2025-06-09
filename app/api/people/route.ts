import { NextResponse } from "next/server"
import { expenseStore } from "@/lib/store"

export async function GET() {
  try {
    const people = await expenseStore.getAllPeople()
    return NextResponse.json({
      success: true,
      data: people,
      message: "People retrieved successfully",
    })
  } catch (error) {
    console.error("GET /api/people error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve people",
      },
      { status: 500 },
    )
  }
}
