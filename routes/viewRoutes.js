const express = require('express');
const viewsController = require('../controllers/viewController');

const Router = express.Router();

Router.get('/', viewsController.getOverview);
Router.get('/tour', viewsController.getTour);

module.exports = Router;
