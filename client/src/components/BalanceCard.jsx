import React from 'react';

const StatCard = ({ label, amount, type }) => {
  const isIncome = type === 'income';
  const isBalance = type === 'balance';

  const colorClass = isBalance
    ? 'from-green-500 to-emerald-600'
    : isIncome
    ? 'from-blue-500 to-indigo-600'
    : 'from-rose-500 to-pink-600';

  const icon = isBalance ? '💰' : isIncome ? '📈' : '📉';

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 text-white shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {!isIncome && !isBalance && amount > 0 ? '-' : ''}
        {formatted}
      </p>
      {isBalance && (
        <p className="text-white/70 text-xs mt-2">
          {amount >= 0 ? '↑ You\'re in the green!' : '↓ Spending more than earning'}
        </p>
      )}
    </div>
  );
};

const BalanceCard = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Income" amount={summary.totalIncome} type="income" />
      <StatCard label="Total Expense" amount={summary.totalExpense} type="expense" />
      <StatCard label="Balance" amount={summary.balance} type="balance" />
    </div>
  );
};

export default BalanceCard;
