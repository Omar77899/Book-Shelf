const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

// Validate :id before it reaches Mongoose
const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: 'Invalid book id' });
  }
  next();
};

// Validate and normalise title/author from the request body
const validateBookBody = (req, res, next) => {
  const { title, author } = req.body || {};
  const errors = [];

  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required and cannot be empty');
  } else if (title.trim().length > 200) {
    errors.push('Title must be 200 characters or fewer');
  }

  if (typeof author !== 'string' || author.trim() === '') {
    errors.push('Author is required and cannot be empty');
  } else if (author.trim().length > 120) {
    errors.push('Author must be 120 characters or fewer');
  }

  if (errors.length) {
    return res.status(400).json({ success: false, error: errors.join('; '), errors });
  }

  req.body = { title: title.trim(), author: author.trim() };
  next();
};

// GET /books -> all books, newest first
router.get('/', async (_req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, count: books.length, data: books });
  } catch (err) {
    next(err);
  }
});

// POST /books -> add a book
router.post('/', validateBookBody, async (req, res, next) => {
  try {
    const book = await Book.create({ title: req.body.title, author: req.body.author });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// PUT /books/:id -> mark a book as read
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:id -> delete a book
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
