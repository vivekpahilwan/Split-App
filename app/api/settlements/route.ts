import { NextResponse } from "next/server"
import { expenseStore } from "../../../lib/store"

export async function GET() {
  try {
    const settlements = await expenseStore.calculateSettlements()
    return NextResponse.json({
      success: true,
      data: settlements,
      message: "Settlements calculated successfully",
    })
  } catch (error) {
    console.error("GET /api/settlements error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate settlements",
      },
      { status: 500 },
    )
  }
}
