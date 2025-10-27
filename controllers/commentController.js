const Comment = require('../models/commentModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadCommentPhoto, resizeCommentPhoto } = require('../utils/upload');
const mongoose = require('mongoose');

// Set tour and user IDs for nested routes
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Get all comments for a specific tour
exports.getTourComments = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const comments = await Comment.getTourComments(tourId, page, limit);
  const totalComments = await Comment.countDocuments({ tour: tourId });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    totalComments,
    currentPage: page,
    totalPages: Math.ceil(totalComments / limit),
    data: {
      comments,
    },
  });
});

// Create a new comment
exports.createComment = catchAsync(async (req, res, next) => {
  const { text, photo } = req.body;
  const tourId = req.params.tourId;
  const userId = req.user.id;

  if (!text && !photo) {
    return next(new AppError('Comment must have text or photo', 400));
  }

  const comment = await Comment.create({
    text: text || '',
    photo,
    tour: tourId,
    user: userId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Add emoji reaction to a comment
exports.addEmojiReaction = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  if (!emoji) {
    return next(new AppError('Emoji is required', 400));
  }

  const comment = await Comment.addEmojiReaction(commentId, userId, emoji);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Toggle like on a comment
exports.toggleLike = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.toggleLike(commentId, userId);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Add reply to a comment
exports.addReply = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return next(new AppError('Reply text is required', 400));
  }

  const comment = await Comment.addReply(commentId, userId, text);

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Get tour emoji reactions summary
exports.getTourEmojiSummary = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  const emojiSummary = await Comment.aggregate([
    { $match: { tour: new mongoose.Types.ObjectId(tourId) } },
    { $unwind: '$emojiReactions' },
    {
      $group: {
        _id: '$emojiReactions.emoji',
        count: { $sum: '$emojiReactions.count' },
        users: { $addToSet: '$emojiReactions.users' },
      },
    },
    {
      $project: {
        emoji: '$_id',
        count: 1,
        uniqueUsers: {
          $size: {
            $reduce: {
              input: '$users',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      emojiSummary,
    },
  });
});

// Upload comment photo
exports.uploadCommentPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No photo uploaded', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      photo: req.file.filename,
    },
  });
});

// Use factory functions for basic CRUD operations
exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
