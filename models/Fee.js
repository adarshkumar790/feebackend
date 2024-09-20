// backend/models/Fee.js

const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  totalFees: { type: Number, required: true },
  paidFees: { type: Number, default: 0 },
  dues: { type: Number, default: 0 },
  payments: [{
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Fee', FeeSchema);
