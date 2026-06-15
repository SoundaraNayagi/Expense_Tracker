import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BalanceCard from '../components/BalanceCard';
import ExpenseChart from '../components/ExpenseChart';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import transactionService from '../services/transactionService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, categoryBreakdown: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [txData, summaryData] = await Promise.all([
        transactionService.getAll(),
        transactionService.getSummary(),
      ]);
      setTransactions(txData.transactions);
      setSummary(summaryData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (data) => {
    const newTx = await transactionService.add(data);
    setTransactions((prev) => [newTx, ...prev]);
    // Refresh summary
    const summaryData = await transactionService.getSummary();
    setSummary(summaryData);
  };

  const handleDelete = async (id) => {
    await transactionService.delete(id);
    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    const summaryData = await transactionService.getSummary();
    setSummary(summaryData);
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.type === filter);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's your financial overview
            </p>
          </div>
          <TransactionForm onAdd={handleAdd} />
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <BalanceCard summary={summary} loading={loading} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions - takes 2/3 */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex gap-1 mb-4 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
              {['all', 'income', 'expense'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    filter === f
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f === 'all' ? '📋 All' : f === 'income' ? '📈 Income' : '📉 Expense'}
                </button>
              ))}
            </div>

            <TransactionTable
              transactions={filteredTransactions}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>

          {/* Pie Chart - takes 1/3 */}
          <div className="lg:col-span-1">
            <ExpenseChart
              categoryBreakdown={summary.categoryBreakdown}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
