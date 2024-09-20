const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();


const adminUsername = 'Adarsh';
const adminPassword = 'password'; 

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    
    if (username !== adminUsername || password !== adminPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign({ username: adminUsername }, 'adarsh', {
        expiresIn: '1h',
    });

    res.json({ token });
});

module.exports = router;
