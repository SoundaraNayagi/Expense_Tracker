import React, { useState } from 'react';
import toast from 'react-hot-toast';

const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Petrol', 'Shopping', 'Entertainment',
  'Health', 'Education', 'Rent', 'Electricity', 'Mobile',
  'Internet', 'Subscriptions', 'Others',
];

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift',
  'Bonus', 'Rental Income', 'Other Income',
];

const TransactionForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) {
      toast.error('Please fill all required fields');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await onAdd({
        ...form,
        amount: parseFloat(form.amount),
      });
      setForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setOpen(false);
      toast.success('Transaction added! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Transaction
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 p-1 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: 'expense', category: '' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    form.type === 'expense'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📉 Expense
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: 'income', category: '' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    form.type === 'income'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📈 Income
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="input-field pl-8"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g. Lunch at Saravana Bhavan"
                  className="input-field"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Transaction'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionForm;
