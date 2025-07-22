const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const Router = express.Router();
Router.use('/:tourId/reviews', reviewRouter);
Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTours,
);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthly-plan/:year').get(
  authController.protect,
<<<<<<< HEAD
  authController.restrictTo('admin', 'lead-guide', 'guide'),
=======
  authController.restrictTo('admin', 'lead-guide', 'guide '),
>>>>>>> factory-pr-8760863
  tourController.getMonthlyPlan,
);

Router.route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
<<<<<<< HEAD
    authController.restrictTo('admin', 'lead guide'),
=======
    authController.restrictTo('admin', 'lead-guide'),
>>>>>>> factory-pr-8760863
    tourController.createTour,
  );
Router.route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = Router;
