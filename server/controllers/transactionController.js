const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, category, limit = 50, page = 1 } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({ transactions, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { amount, type, category, description, date } = req.body;

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};

// @desc    Get summary (total income, expense, balance + category breakdown)
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((r) => {
      if (r._id === 'income') totalIncome = r.total;
      if (r._id === 'expense') totalExpense = r.total;
    });

    // Category breakdown for expenses (for pie chart)
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c._id,
        amount: c.total,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
};

module.exports = { getTransactions, addTransaction, deleteTransaction, getSummary };
