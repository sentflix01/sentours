const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const Router = express.Router();
Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

<<<<<<< HEAD
// protect all routes after this middleware
Router.use(authController.protect);

Router.patch('/updateMyPassword', authController.updatePassword);
// Router.get('/me', userController.getMe, userController.getUser);
Router.get('/me', authController.protect, userController.getUser);
// Router.get('/me', userController.getMe);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);

// all below action for users are authorized for admin only
Router.use(authController.restrictTo('admin'));
=======
// protect all route after this middleware
Router.use(authController.protect);
Router.patch('/updateMyPassword', authController.updatePassword);
Router.get('/me', userController.getMe, userController.getUser);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);
>>>>>>> factory-pr-8760863

Router.use(authController.restrictTo('admin'));
Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
