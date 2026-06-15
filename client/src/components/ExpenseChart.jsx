import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-green-600 font-bold">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(data.value)}
        </p>
        <p className="text-gray-500 text-xs">{data.payload.percent}%</p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ categoryBreakdown, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12">
        <div className="text-5xl mb-4">🥧</div>
        <p className="text-gray-500 font-medium">No expense data yet</p>
        <p className="text-gray-400 text-sm mt-1">Add some expenses to see the chart</p>
      </div>
    );
  }

  const total = categoryBreakdown.reduce((sum, c) => sum + c.amount, 0);
  const data = categoryBreakdown.map((c) => ({
    name: c.category,
    value: c.amount,
    percent: ((c.amount / total) * 100).toFixed(1),
  }));

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Spending Breakdown</h2>
      <p className="text-sm text-gray-500 mb-6">Where your money is going</p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category list */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">{item.percent}%</span>
              <span className="text-sm font-semibold text-gray-800">
                ₹{item.value.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
