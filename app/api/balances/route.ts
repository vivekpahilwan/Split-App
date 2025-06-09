import { NextResponse } from "next/server"
import { expenseStore } from "../../../lib/store"

export async function GET() {
  try {
    const balances = await expenseStore.calculateBalances()
    return NextResponse.json({
      success: true,
      data: balances,
      message: "Balances calculated successfully",
    })
  } catch (error) {
    console.error("GET /api/balances error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate balances",
      },
      { status: 500 },
    )
  }
}
