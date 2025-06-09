import { NextResponse } from "next/server"
import { expenseStore } from "@/lib/store"

export async function GET() {
  try {
    const categoryData = await expenseStore.getExpensesByCategory()
    return NextResponse.json({
      success: true,
      data: categoryData,
      message: "Category analytics retrieved successfully",
    })
  } catch (error) {
    console.error("GET /api/analytics/categories error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve category analytics",
      },
      { status: 500 },
    )
  }
}
