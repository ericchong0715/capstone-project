require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors({
<<<<<<< HEAD
  origin: ['http://localhost:5173', 'https://socmed-frontend-arcp.onrender.com', 'https://capstoneproject-socmed.netlify.app'], // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
=======
  origin: ['http://localhost:5173', 'https://socmed-frontend-arcp.onrender.com', 'https://capstoneproject-socmed.netlify.app'],
>>>>>>> 8f9d669fef5767c32ccde46baa3856aa77ea8c9d
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Global Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.message);
    console.error(err.stack); // Log the full stack trace

    // Check if headers have already been sent to prevent errors
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).json({
        error: err.message || 'Something went wrong!'
    });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
