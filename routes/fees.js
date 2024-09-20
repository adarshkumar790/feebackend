// backend/routes/fees.js
const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// Get fee details by student ID
router.get('/:studentId', async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentId: req.params.studentId });
    if (!fee) {
      return res.status(404).json({ message: 'No fee details found for this student' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update fee details for a student
router.post('/', async (req, res) => {
  const { studentId, totalFees, paidFees, dues, payments } = req.body;

  try {
    let fee = await Fee.findOne({ studentId });

    if (fee) {
      // Update existing fee details
      fee.totalFees = totalFees;
      fee.paidFees = paidFees;
      fee.dues = dues;
      fee.payments = payments;
      await fee.save();
    } else {
      // Create new fee details
      fee = new Fee({ studentId, totalFees, paidFees, dues, payments });
      await fee.save();
    }

    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fee details by student ID
router.put('/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { totalFees, paidFees, dues, payments } = req.body;

  try {
    let fee = await Fee.findOne({ studentId });

    if (!fee) {
      return res.status(404).json({ message: 'No fee details found for this student' });
    }

    // Update existing fee details
    fee.totalFees = totalFees || fee.totalFees;
    fee.paidFees = paidFees || fee.paidFees;
    fee.dues = dues || fee.dues;
    if (payments) {
      fee.payments.push(...payments);
    }
    await fee.save();

    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Utility function to get start and end dates for different time periods
const getTimePeriod = (period) => {
  const now = new Date();
  let start, end;

  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'weekly':
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - day));
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'biannually':
      const half = now.getMonth() < 6 ? 0 : 6;
      start = new Date(now.getFullYear(), half, 1);
      end = new Date(now.getFullYear(), half + 6, 1);
      break;
    default:
      throw new Error('Invalid period');
  }

  return { start, end };
};

// Get fee collection based on time period
router.get('/collection/:period', async (req, res) => {
  const { period } = req.params;

  try {
    const { start, end } = getTimePeriod(period);

    const fees = await Fee.aggregate([
      { $unwind: '$payments' }, // Decompose payments array
      { $match: { 'payments.date': { $gte: start, $lt: end } } }, // Filter by date range
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$payments.amount' },
          totalDues: { $sum: '$dues' },
        }
      }
    ]);

    res.json(fees[0] || { totalCollected: 0, totalDues: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getSpecificDay = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Set to start of the day
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // Set to end of the day
  return { start, end };
};

// Get fee collection for a specific date
router.get('/collection/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const { start, end } = getSpecificDay(date);

    const fees = await Fee.aggregate([
      { $unwind: { path: '$payments', preserveNullAndEmptyArrays: true } }, // Ensure payments are returned as an empty array if none
      { $match: { 'payments.date': { $gte: start, $lt: end } } }, // Filter by date range
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$payments.amount' },
          totalDues: { $sum: '$dues' },
          payments: { $push: '$payments' } // Add the matched payments to the response
        }
      }
    ]);

    // Default to empty values if no records found
    const result = fees[0] || { totalCollected: 0, totalDues: 0, payments: [] };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

