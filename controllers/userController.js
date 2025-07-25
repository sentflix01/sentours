// const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');
// const { deleteOne } = require('../models/tourModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if users POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use / updateMyPassword.',
        400,
      ),
    );
  }

  //2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/*const change to export*/ exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined  Please use /signup instead',
  });
};
/*const change to export*/ exports.getUser = factory.getOne(User);
/*const change to export*/ exports.getAllUsers = factory.getAll(User);
// Do not update password with this!
/*const change to export*/ exports.updateUser = factory.updateOne(User);
/*const change to export*/ exports.deleteUser = factory.deleteOne(User);
