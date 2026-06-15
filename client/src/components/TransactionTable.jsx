import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const categoryEmoji = {
  Food: '🍽️', Transport: '🚌', Petrol: '⛽', Shopping: '🛍️',
  Entertainment: '🎮', Health: '💊', Education: '📚', Rent: '🏠',
  Electricity: '💡', Mobile: '📱', Internet: '🌐', Subscriptions: '📺',
  Salary: '💼', Freelance: '💻', Business: '🏢', Investment: '📊',
  Gift: '🎁', Bonus: '🎯', Others: '📦', 'Other Income': '💵',
  'Rental Income': '🏘️',
};

const TransactionTable = ({ transactions, onDelete, loading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success('Transaction deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-600 font-semibold">No transactions yet</p>
        <p className="text-gray-400 text-sm mt-1">Add your first transaction above</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-0.5">{transactions.length} transactions</p>
        </div>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx._id}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
          >
            {/* Left: Icon + Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                tx.type === 'income' ? 'bg-green-50' : 'bg-rose-50'
              }`}>
                {categoryEmoji[tx.category] || '💰'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {tx.category}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {tx.description || 'No description'} · {format(new Date(tx.date), 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            {/* Right: Amount + Delete */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              <span className={`font-bold text-base ${
                tx.type === 'income' ? 'text-green-600' : 'text-rose-500'
              }`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </span>

              <button
                onClick={() => handleDelete(tx._id)}
                disabled={deletingId === tx._id}
                className="w-7 h-7 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === tx._id ? (
                  <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
