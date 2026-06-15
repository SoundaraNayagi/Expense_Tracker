const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);

router.get('/', getTransactions);

router.post(
  '/',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  addTransaction
);

router.delete('/:id', deleteTransaction);

module.exports = router;
