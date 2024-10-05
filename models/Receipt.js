// models/Receipt.js

const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptno: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  admissionfee: { type: Number, required: true },
  developmentFund: { type: Number, required: true },
  tuitionFee: { type: Number, required: true },
  libFee: { type: Number, required: true },
  labFee: { type: Number, required: true },
  computerLabFee: { type: Number, required: true },
  transportFee: { type: Number, required: true },
  gameFee: { type: Number, required: true },
  examinationFee: { type: Number, required: true },
  journalMagazine: { type: Number, required: true },
  culturalActivity: { type: Number, required: true },
  prospectusFee: { type: Number, required: true },
  other: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // Add this line
}, { timestamps: true });

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
