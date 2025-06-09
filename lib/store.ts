import { supabase, type Expense } from "./supabase"

interface Balance {
  person: string
  balance: number
  owes: number
  owed: number
}

interface Settlement {
  from: string
  to: string
  amount: number
}

class ExpenseStore {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching expenses:", error)
        throw new Error("Failed to fetch expenses")
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllExpenses:", error)
      throw error
    }
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // Not found
        }
        console.error("Error fetching expense:", error)
        throw new Error("Failed to fetch expense")
      }

      return data
    } catch (error) {
      console.error("Error in getExpenseById:", error)
      throw error
    }
  }

  async addExpense(expense: {
    amount: number
    description: string
    paid_by: string
    category?: string
  }): Promise<Expense> {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            amount: expense.amount,
            description: expense.description.trim(),
            paid_by: expense.paid_by.trim(),
            category: expense.category || "Other",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error adding expense:", error)
        throw new Error("Failed to add expense")
      }

      return data
    } catch (error) {
      console.error("Error in addExpense:", error)
      throw error
    }
  }

  async updateExpense(
    id: string,
    updates: {
      amount?: number
      description?: string
      paid_by?: string
      category?: string
    },
  ): Promise<Expense> {
    try {
      const cleanUpdates: any = {}

      if (updates.amount !== undefined) cleanUpdates.amount = updates.amount
      if (updates.description !== undefined) cleanUpdates.description = updates.description.trim()
      if (updates.paid_by !== undefined) cleanUpdates.paid_by = updates.paid_by.trim()
      if (updates.category !== undefined) cleanUpdates.category = updates.category

      const { data, error } = await supabase.from("expenses").update(cleanUpdates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating expense:", error)
        throw new Error("Failed to update expense")
      }

      return data
    } catch (error) {
      console.error("Error in updateExpense:", error)
      throw error
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) {
        console.error("Error deleting expense:", error)
        throw new Error("Failed to delete expense")
      }
    } catch (error) {
      console.error("Error in deleteExpense:", error)
      throw error
    }
  }

  async getAllPeople(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("expenses").select("paid_by")

      if (error) {
        console.error("Error fetching people:", error)
        throw new Error("Failed to fetch people")
      }

      const people = new Set<string>()
      data?.forEach((expense) => {
        people.add(expense.paid_by)
      })

      return Array.from(people).sort()
    } catch (error) {
      console.error("Error in getAllPeople:", error)
      throw error
    }
  }

  async calculateBalances(): Promise<Balance[]> {
    try {
      const expenses = await this.getAllExpenses()
      const people = await this.getAllPeople()

      if (people.length === 0) return []

      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const sharePerPerson = totalExpenses / people.length

      const balances: Balance[] = people.map((person) => {
        const totalPaid = expenses
          .filter((expense) => expense.paid_by === person)
          .reduce((sum, expense) => sum + expense.amount, 0)

        const balance = totalPaid - sharePerPerson

        return {
          person,
          balance: Number.parseFloat(balance.toFixed(2)),
          owes: Number.parseFloat(sharePerPerson.toFixed(2)),
          owed: Number.parseFloat(totalPaid.toFixed(2)),
        }
      })

      return balances.sort((a, b) => b.balance - a.balance)
    } catch (error) {
      console.error("Error in calculateBalances:", error)
      throw error
    }
  }

  async calculateSettlements(): Promise<Settlement[]> {
    try {
      const balances = await this.calculateBalances()
      if (balances.length === 0) return []

      const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance)
      const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance)

      const settlements: Settlement[] = []
      let i = 0,
        j = 0

      while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i]
        const debtor = debtors[j]

        const amount = Math.min(creditor.balance, Math.abs(debtor.balance))

        if (amount > 0.01) {
          settlements.push({
            from: debtor.person,
            to: creditor.person,
            amount: Number.parseFloat(amount.toFixed(2)),
          })
        }

        creditor.balance -= amount
        debtor.balance += amount

        if (Math.abs(creditor.balance) < 0.01) i++
        if (Math.abs(debtor.balance) < 0.01) j++
      }

      return settlements
    } catch (error) {
      console.error("Error in calculateSettlements:", error)
      throw error
    }
  }
}

export const expenseStore = new ExpenseStore()
