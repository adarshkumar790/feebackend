// routes/receipts.js

const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');

// POST /api/receipts - Create a new receipt
router.post('/', async (req, res) => {
  try {
    const {
      receiptno,
      name,
      rollno,
      admissionfee,
      developmentFund,
      tuitionFee,
      libFee,
      labFee,
      computerLabFee,
      transportFee,
      gameFee,
      examinationFee,
      journalMagazine,
      culturalActivity,
      prospectusFee,
      other,
      totalAmount,
      date, // Add date to the destructured properties
    } = req.body;

    // Check if receipt number already exists
    const existingReceipt = await Receipt.findOne({ receiptno });
    if (existingReceipt) {
      return res.status(400).json({ error: 'Receipt number already exists.' });
    }

    const receipt = new Receipt({
      receiptno,
      name,
      rollno,
      admissionfee,
      developmentFund,
      tuitionFee,
      libFee,
      labFee,
      computerLabFee,
      transportFee,
      gameFee,
      examinationFee,
      journalMagazine,
      culturalActivity,
      prospectusFee,
      other,
      totalAmount,
      date: date ? new Date(date) : undefined, // Use the provided date or default to undefined
    });

    await receipt.save();
    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/receipts - Get all receipts
router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/receipts/:id - Get a single receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found.' });
    }
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
