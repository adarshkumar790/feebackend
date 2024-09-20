const Student = require('../models/Student');

// @desc    Get students by class
// @route   GET /api/students/:class
// @access  Public
const getStudentsByClass = async (req, res) => {
  const { class: studentClass } = req.params;
  try {
    const students = await Student.find({ class: studentClass });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add new student
// @route   POST /api/students
// @access  Public
const addStudent = async (req, res) => {
  const { name, class: studentClass, rollNo } = req.body;

  if (!name || !studentClass || rollNo == null) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const newStudent = new Student({
    name,
    class: studentClass,
    rollNo,
  });

  try {
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getStudentsByClass, addStudent };
