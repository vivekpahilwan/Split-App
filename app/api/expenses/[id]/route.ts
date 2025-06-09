import { type NextRequest, NextResponse } from "next/server"
import { expenseStore } from "../../../../lib/store"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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

    // Check if expense exists
    const existingExpense = await expenseStore.getExpenseById(id)
    if (!existingExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 },
      )
    }

    const updatedExpense = await expenseStore.updateExpense(id, {
      amount: Number.parseFloat(amount.toFixed(2)),
      description,
      paid_by,
      category,
    })

    return NextResponse.json({
      success: true,
      data: updatedExpense,
      message: "Expense updated successfully",
    })
  } catch (error) {
    console.error("PUT /api/expenses/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update expense",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if expense exists
    const existingExpense = await expenseStore.getExpenseById(id)
    if (!existingExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 },
      )
    }

    await expenseStore.deleteExpense(id)

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete expense",
      },
      { status: 500 },
    )
  }
}
