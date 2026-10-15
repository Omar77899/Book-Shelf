require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookshelf';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => res.json({ success: true, message: 'BookShelf API is running' }));
app.use('/books', booksRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Malformed JSON in request body' });
  }
  // Mongoose validation (missing / invalid fields)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: errors.join('; '), errors });
  }
  // Invalid ObjectId cast
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: `Invalid ${err.path}` });
  }
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
