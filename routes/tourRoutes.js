const express = require('express');
const tourController = require('../controllers/tourController');
const Router = express.Router();

Router.param('id', tourController.checkedID);



// create a checkbody middleware
// check if body contains the name price property
// if not, send back 400 (bad request)
// Add it the post handler stack

Router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody,tourController.createTour);
Router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
