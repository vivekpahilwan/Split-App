# Expense Splitter Backend API

A comprehensive backend system for splitting expenses among groups of people, similar to Splitwise. Built with Next.js, TypeScript, and Supabase PostgreSQL.

## 🚀 Features

### Core Features
- ✅ **Expense Tracking**: Add, view, edit, delete expenses
- ✅ **Automatic Person Management**: People added automatically from expenses
- ✅ **Smart Settlement Calculations**: Minimized transaction settlements
- ✅ **Data Validation**: Comprehensive input validation and error handling
- ✅ **Categories**: Organize expenses by categories (Food, Travel, etc.)

### API Endpoints

#### Expense Management
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

#### Settlement & People
- `GET /api/settlements` - Get optimized settlement summary
- `GET /api/balances` - Show each person's balance
- `GET /api/people` - List all people

## 🛠 Tech Stack

- **Backend**: Next.js 14 with App Router
- **Database**: Supabase PostgreSQL
- **Language**: TypeScript
- **Deployment**: Railway.app
- **Styling**: Pure CSS (no external UI libraries)

## 📊 Database Schema

\`\`\`sql
expenses:
- id (UUID, Primary Key)
- amount (DECIMAL, > 0)
- description (TEXT, Required)
- paid_by (VARCHAR, Required)
- category (VARCHAR, Default: 'Other')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
\`\`\`

## 🔧 Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run database migrations
5. Start development server: `npm run dev`

## 🌍 Environment Variables

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 🧮 Settlement Algorithm

The system uses an optimized debt settlement algorithm that:
- Calculates each person's net balance (paid vs. fair share)
- Matches creditors with debtors efficiently
- Minimizes total number of transactions needed
- Handles floating-point precision properly

## 📝 API Usage Examples

### Add Expense
\`\`\`bash
POST /api/expenses
{
  "amount": 600.00,
  "description": "Dinner at restaurant",
  "paid_by": "Shantanu",
  "category": "Food"
}
\`\`\`

### Get Settlements
\`\`\`bash
GET /api/settlements
Response: [
  {
    "from": "Sanket",
    "to": "Shantanu", 
    "amount": 150.00
  }
]
\`\`\`

## 🚀 Deployment

Deployed on Railway.app with Supabase PostgreSQL database.

## 📋 Testing

Use the provided Postman collection for comprehensive API testing with pre-populated sample data.

## 🎯 Key Assumptions

- Equal split among all people mentioned in expenses
- Amounts rounded to 2 decimal places for currency precision
- Person names are case-sensitive
- Categories are optional (default: "Other")

## 🔍 Error Handling

- Proper HTTP status codes (200, 201, 400, 404, 500)
- Descriptive error messages
- Input validation for all endpoints
- Database constraint validation

## 📦 Dependencies

Minimal dependencies for lightweight deployment:
- Next.js 14
- React 18
- Supabase JavaScript client
- TypeScript

No external UI libraries or date manipulation libraries used.
