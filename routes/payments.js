// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// Get a single payment by payment ID
router.get('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    const fee = await Fee.findOne({ 'payments._id': paymentId }, { 'payments.$': 1 });
    if (!fee) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(fee.payments[0]); // Return the single payment
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
