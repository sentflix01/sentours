const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const Router = express.Router();

// Router.param('id', tourController.checkedID);

// create a check body middleware
// check if body contains the name price property
// if not, send back 400 (bad request)
// Add it the post handler stack

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTours,
);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

Router.route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
Router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = Router;
