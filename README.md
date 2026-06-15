# 💰 Expense Tracker - Full Stack App

A complete full-stack expense tracker with React frontend and Node.js + Express backend with MongoDB.

## Features
- 🔐 User Authentication (Signup / Login / Logout)
- ➕ Add Income & Expense Transactions
- 📊 Dashboard with Balance, Total Income & Expense
- 📜 Transaction History
- 🥧 Pie Chart for spending patterns

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)

## Setup Instructions

### 1. Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 2. Clone & Install
```bash
npm run install-all
```

### 3. Configure Environment Variables
Edit `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Run the App
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Add transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary | Get summary |
