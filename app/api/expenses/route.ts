import { type NextRequest, NextResponse } from "next/server"
import { expenseStore } from "../../../lib/store"

export async function GET() {
  try {
    const expenses = await expenseStore.getAllExpenses()
    return NextResponse.json({
      success: true,
      data: expenses,
      message: "Expenses retrieved successfully",
    })
  } catch (error) {
    console.error("GET /api/expenses error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve expenses",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, paid_by, category = "Other" } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be a positive number",
        },
        { status: 400 },
      )
    }

    if (!description || description.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required",
        },
        { status: 400 },
      )
    }

    if (!paid_by || paid_by.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Paid by field is required",
        },
        { status: 400 },
      )
    }

    const expense = await expenseStore.addExpense({
      amount: Number.parseFloat(amount.toFixed(2)),
      description,
      paid_by,
      category,
    })

    return NextResponse.json(
      {
        success: true,
        data: expense,
        message: "Expense added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/expenses error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add expense",
      },
      { status: 500 },
    )
  }
}
