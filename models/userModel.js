const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email photo password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please', 'Please confirm your password'],
    validate: {
      // this only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
});

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  if (this.isNew) {
    this.passwordChangeAt = Date.now();
  } else {
    this.passwordChangeAt = Date.now() - 1000; // Subtract 1s to ensure token is created after password has been changed
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // 100days the token is generated and < after 200days the password changed time so 100 < 200 means the password is changed and the result is true and otherwise the result is false which means not changed.
  }
  // false means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
