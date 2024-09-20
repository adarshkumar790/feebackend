const express = require('express');
const { getStudentsByClass, addStudent } = require('../controllers/studentController');

const router = express.Router();

router.get('/:class', getStudentsByClass);
router.post('/', addStudent);

module.exports = router;
