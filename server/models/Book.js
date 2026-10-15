const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be 200 characters or fewer'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [120, 'Author must be 120 characters or fewer'],
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      // Return MongoDB's _id as `id` and keep the shape { id, title, author, status, createdAt }
      transform: (_doc, ret) => {
        const { _id, title, author, status, createdAt } = ret;
        return { id: _id.toString(), title, author, status, createdAt };
      },
    },
  }
);

module.exports = mongoose.model('Book', bookSchema);
