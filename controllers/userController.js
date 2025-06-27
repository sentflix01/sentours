const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

/*const change to export*/ exports.getAllUsers = catchAsync(
  async (req, res, next) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  },
);
/*const change to export*/ exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
/*const change to export*/ exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
/*const change to export*/ exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
/*const change to export*/ exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
