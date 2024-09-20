const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const feeRoutes = require('./routes/fees');
const paymentRoutes = require('./routes/payments'); 
const authRoutes = require('./routes/auth');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: ['http://localhost:3000'], // Allow all origins (change to specific origins in production)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', authRoutes); // Corrected the route path

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
