import { NextResponse } from "next/server"
import { expenseStore } from "@/lib/store"

export async function GET() {
  try {
    const monthlyData = await expenseStore.getMonthlySpending()
    return NextResponse.json({
      success: true,
      data: monthlyData,
      message: "Monthly analytics retrieved successfully",
    })
  } catch (error) {
    console.error("GET /api/analytics/monthly error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve monthly analytics",
      },
      { status: 500 },
    )
  }
}
