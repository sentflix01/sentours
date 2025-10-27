const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
const { uploadCommentPhoto, resizeCommentPhoto } = require('../utils/upload');

const Router = express.Router({ mergeParams: true });

// Public routes (no authentication required)
Router.route('/').get(commentController.getTourComments);

Router.route('/emoji-summary').get(commentController.getTourEmojiSummary);

// Protected routes (authentication required)
Router.use(authController.protect);

Router.route('/').post(
  authController.restrictTo('user'),
  commentController.setTourUserIds,
  commentController.createComment,
);

Router.route('/upload-photo').post(
  authController.restrictTo('user'),
  uploadCommentPhoto,
  resizeCommentPhoto,
  commentController.uploadCommentPhoto,
);

Router.route('/:commentId/like').post(commentController.toggleLike);

Router.route('/:commentId/emoji').post(commentController.addEmojiReaction);

Router.route('/:commentId/reply').post(commentController.addReply);

Router.route('/:commentId')
  .get(commentController.getComment)
  .patch(
    authController.restrictTo('user', 'admin'),
    commentController.updateComment,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    commentController.deleteComment,
  );

module.exports = Router;
