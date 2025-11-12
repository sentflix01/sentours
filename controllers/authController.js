const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    // jwt.sign({ id }, process.env.JWT_SECRET, { the JWT_SECRET is a secret key for signing the token and the secret key length must be 256 bits or 32 bytes. This is a security best practice.
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRE_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === `https`,
  });

  // Remove the password the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser && existingUser.emailVerified)
    return next(new AppError('Email already exists — please login', 400));

  // 2) Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    emailVerified: false,
  });
  // 3) Generate email verification token
  const verificationToken = newUser.createEmailVerifyToken();
  await newUser.save({ validateBeforeSave: false });
  // 4) Send email verification email (CRITICAL - must succeed)
  const verifyURL = `${req.protocol}://${req.get('host')}/verifyEmail/${verificationToken}`;
  try {
    await new Email(newUser, verifyURL).sendVerificationEmail();
    console.log('Email verification email sent successfully');
  } catch (error) {
    console.error('Email verification email sending failed:', error);
    // Delete unverified user if verification email fails
    await newUser.deleteOne();
    return next(
      new AppError(
        'Failed to send email verification email. Please try again later.',
        500,
      ),
    );
  }

  // 5) Send welcome email (NON-CRITICAL - log error but don't fail signup)
  const welcomeURL = `${req.protocol}://${req.get('host')}/me`;
  try {
    await new Email(newUser, welcomeURL).sendWelcome();
    console.log('Welcome email sent successfully');
  } catch (error) {
    // Log error but don't fail signup - verification email is more important
    console.error(
      'Welcome email sending failed (non-critical):',
      error.message,
    );
  }

  // 6) Return success response (don't log user in - they must verify email first)
  res.status(201).json({
    status: 'success',
    message:
      'Account created successfully! Please check your email to verify your account before logging in.',
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
  console.log('Signup completed successfully');
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const autoLogin = req.query.autoLogin === 'true'; // enable via link param

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });

  // If user not found or expired
  if (!user) {
    // Check if token exists but expired
    const expiredUser = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (expiredUser) {
      return res.status(400).render('error', {
        title: 'Token Expired',
        msg: 'This email verification link has expired. Please request a new verification email or contact support if you need assistance.',
      });
    }

    // Check if user exists but email is already verified
    const usersWithToken = await User.find({
      emailVerificationToken: { $exists: true, $ne: null },
    }).select('email emailVerified emailVerificationTokenExpires');

    // Render friendly error page (not JSON)
    return res.status(400).render('error', {
      title: 'Invalid or Expired Token',
      msg: 'This email verification link is invalid or has expired. Please request a new verification email or contact support if you need assistance.',
    });
  }

  // Mark email as verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // If auto-login enabled, set cookie and redirect
  if (autoLogin) {
    createSendToken(user, 200, req, res);
  } else {
    return res.status(200).render('success', {
      title: 'Email Verified!',
      msg: 'Your email has been successfully verified! You can now log in to your account.',
      showLogin: true,
      showHome: true,
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) check if email is verified
  if (!user.emailVerified) {
    return next(
      new AppError(
        'Please verify your email before logging in. Check your inbox for the verification link.',
        401,
      ),
    );
  }

  //4) if everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  // console.log('Decoded user ID:', decoded.id);
  const currentUser = await User.findById(decoded.id);
  // console.log('User found by ID:', currentUser);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this user does no longer exist.',
        401,
      ),
    );
  }
  // 4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  } /*iat stands for issues at*/

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// only render pager not error
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) varify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      // 2) check if user still exists
      // console.log('Decoded user ID:', decoded.id);
      const currentUser = await User.findById(decoded.id);
      // console.log('User found by ID:', currentUser);
      if (!currentUser) {
        return next();
      }
      // 3) check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      } /*iat stands for issues at*/

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // <-- Add this line
    // roles ['admin', 'lead-guide'].  role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address. 404'));
  }

  // 2) Generate the random reset token
  const resetToken = user.correctResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. try again later!'),
      500,
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired, 400 '));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update change dPasswordAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get the user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //2) check if Posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  //3) if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // UserByIdAndUpdate will Not work as intended!
  //4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
