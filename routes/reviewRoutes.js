const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const Router = express.Router({ mergeParams: true });

<<<<<<< HEAD
router.use(authController.protect);
router
  .route('/')
=======
Router.use(authController.protect);
Router.route('/')
>>>>>>> factory-pr-8760863
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

<<<<<<< HEAD
router
  .route('/:id')
=======
Router.route('/:id')
>>>>>>> factory-pr-8760863
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = Router;
