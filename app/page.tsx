"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"

interface Expense {
  id: string
  amount: number
  description: string
  paid_by: string
  created_at: string
  category?: string
}

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

export default function ExpenseSplitter() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [people, setPeople] = useState<string[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState("expenses")
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Form states
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [category, setCategory] = useState("Other")

  const categories = ["Food", "Travel", "Utilities", "Entertainment", "Other"]

  useEffect(() => {
    fetchData()
  }, [])

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchData = async () => {
    try {
      await Promise.all([fetchExpenses(), fetchPeople(), fetchBalances(), fetchSettlements()])
    } catch (error) {
      showNotification("Failed to fetch data", "error")
    }
  }

  const fetchExpenses = async () => {
    const response = await fetch("/api/expenses")
    const data = await response.json()
    if (data.success) {
      setExpenses(data.data)
    }
  }

  const fetchPeople = async () => {
    const response = await fetch("/api/people")
    const data = await response.json()
    if (data.success) {
      setPeople(data.data)
    }
  }

  const fetchBalances = async () => {
    const response = await fetch("/api/balances")
    const data = await response.json()
    if (data.success) {
      setBalances(data.data)
    }
  }

  const fetchSettlements = async () => {
    const response = await fetch("/api/settlements")
    const data = await response.json()
    if (data.success) {
      setSettlements(data.data)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          description,
          paid_by: paidBy,
          category,
        }),
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, "success")
        setAmount("")
        setDescription("")
        setPaidBy("")
        setCategory("Other")
        await fetchData()
      } else {
        showNotification(data.message, "error")
      }
    } catch (error) {
      showNotification("Failed to add expense", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExpense) return

    setLoading(true)

    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          description,
          paid_by: paidBy,
          category,
        }),
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, "success")
        setEditingExpense(null)
        setAmount("")
        setDescription("")
        setPaidBy("")
        setCategory("Other")
        await fetchData()
      } else {
        showNotification(data.message, "error")
      }
    } catch (error) {
      showNotification("Failed to update expense", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        showNotification(data.message, "success")
        await fetchData()
      } else {
        showNotification(data.message, "error")
      }
    } catch (error) {
      showNotification("Failed to delete expense", "error")
    }
  }

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setAmount(expense.amount.toString())
    setDescription(expense.description)
    setPaidBy(expense.paid_by)
    setCategory(expense.category || "Other")
  }

  const cancelEdit = () => {
    setEditingExpense(null)
    setAmount("")
    setDescription("")
    setPaidBy("")
    setCategory("Other")
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "positive"
    if (balance < 0) return "negative"
    return "neutral"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container">
      {/* Notification */}
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      {/* Header */}
      <div className="header">
        <h1>Expense Splitter</h1>
        <p>Split expenses fairly among friends and roommates</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === "expenses" ? "active" : ""}`} onClick={() => setActiveTab("expenses")}>
          📋 Expenses
        </button>
        <button className={`tab ${activeTab === "people" ? "active" : ""}`} onClick={() => setActiveTab("people")}>
          👥 People
        </button>
        <button className={`tab ${activeTab === "balances" ? "active" : ""}`} onClick={() => setActiveTab("balances")}>
          💰 Balances
        </button>
        <button
          className={`tab ${activeTab === "settlements" ? "active" : ""}`}
          onClick={() => setActiveTab("settlements")}
        >
          🔄 Settlements
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "expenses" && (
          <div>
            {/* Add/Edit Expense Form */}
            <div className="card">
              <div className="card-header">
                <h2>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>
                <p>{editingExpense ? "Update the expense details" : "Add a new expense to split among the group"}</p>
              </div>
              <div className="card-content">
                <form onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="amount">Amount (₹)</label>
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="paid_by">Paid By</label>
                      <input
                        id="paid_by"
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        placeholder="Person's name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What was this expense for?"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Processing..." : editingExpense ? "Update Expense" : "Add Expense"}
                    </button>
                    {editingExpense && (
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Expenses List */}
            <div className="card">
              <div className="card-header">
                <h2>All Expenses</h2>
                <p>View and manage all recorded expenses</p>
              </div>
              <div className="card-content">
                {expenses.length === 0 ? (
                  <div className="empty-state">No expenses recorded yet</div>
                ) : (
                  <div className="expenses-list">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="expense-item">
                        <div className="expense-details">
                          <div className="expense-title">
                            <h3>{expense.description}</h3>
                            <span className="badge">{expense.category}</span>
                          </div>
                          <p className="expense-meta">
                            Paid by {expense.paid_by} • {formatDate(expense.created_at)}
                          </p>
                        </div>
                        <div className="expense-actions">
                          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-outline" onClick={() => startEdit(expense)}>
                              ✏️
                            </button>
                            <button
                              className="btn btn-small btn-outline"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "people" && (
          <div className="card">
            <div className="card-header">
              <h2>People</h2>
              <p>All people involved in expenses</p>
            </div>
            <div className="card-content">
              {people.length === 0 ? (
                <div className="empty-state">No people found. Add some expenses first!</div>
              ) : (
                <div className="people-grid">
                  {people.map((person) => (
                    <div key={person} className="person-card">
                      <div className="person-avatar">👤</div>
                      <h3>{person}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "balances" && (
          <div className="card">
            <div className="card-header">
              <h2>Current Balances</h2>
              <p>See who owes money and who should receive money</p>
            </div>
            <div className="card-content">
              {balances.length === 0 ? (
                <div className="empty-state">No balances to show. Add some expenses first!</div>
              ) : (
                <div className="balances-list">
                  {balances.map((balance) => (
                    <div key={balance.person} className="balance-item">
                      <div className="balance-details">
                        <h3>{balance.person}</h3>
                        <p>
                          Paid: {formatCurrency(balance.owed)} • Share: {formatCurrency(balance.owes)}
                        </p>
                      </div>
                      <div className="balance-amount">
                        <span className={`balance-value ${getBalanceColor(balance.balance)}`}>
                          {balance.balance > 0 ? "+" : ""}
                          {formatCurrency(balance.balance)}
                        </span>
                        <p className="balance-status">
                          {balance.balance > 0 ? "Should receive" : balance.balance < 0 ? "Should pay" : "Settled"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settlements" && (
          <div className="card">
            <div className="card-header">
              <h2>Settlement Summary</h2>
              <p>Optimized transactions to settle all debts</p>
            </div>
            <div className="card-content">
              {settlements.length === 0 ? (
                <div className="empty-state">
                  {expenses.length === 0 ? "No expenses to settle" : "Everyone is settled up! 🎉"}
                </div>
              ) : (
                <div className="settlements-list">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="settlement-item">
                      <div className="settlement-flow">
                        <div className="person-bubble from">{settlement.from[0]}</div>
                        <span className="arrow">→</span>
                        <div className="person-bubble to">{settlement.to[0]}</div>
                      </div>
                      <div className="settlement-details">
                        <span className="settlement-amount">{formatCurrency(settlement.amount)}</span>
                        <p>
                          {settlement.from} pays {settlement.to}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
