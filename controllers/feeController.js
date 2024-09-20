const Fee = require('../models/Fee');

// @desc    Get fee details by student
// @route   GET /api/fees/:studentId
// @access  Public
const getFeeDetailsByStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const feeDetails = await Fee.findOne({ student: studentId }).populate('student');
    if (!feeDetails) {
      return res.status(404).json({ message: 'Fee details not found' });
    }
    res.json(feeDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add or update fee details for a student
// @route   POST /api/fees/:studentId
// @access  Public
const addOrUpdateFeeDetails = async (req, res) => {
  const { studentId } = req.params;
  const { totalFees, paidFees, dues, payments } = req.body;

  try {
    let feeDetails = await Fee.findOne({ student: studentId });

    if (feeDetails) {
      // Update existing fee details
      feeDetails.totalFees = totalFees || feeDetails.totalFees;
      feeDetails.paidFees = paidFees || feeDetails.paidFees;
      feeDetails.dues = dues || feeDetails.dues;
      if (payments) {
        feeDetails.payments.push(...payments);
      }
      feeDetails = await feeDetails.save();
    } else {
      // Create new fee details
      feeDetails = new Fee({
        student: studentId,
        totalFees,
        paidFees,
        dues,
        payments,
      });
      await feeDetails.save();
    }

    res.status(201).json(feeDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getFeeDetailsByStudent, addOrUpdateFeeDetails };
