const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  Tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: ['True', 'Booking must belong to a Tour!'],
  },
  User: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: ['True', 'Booking Must belong to a User!'],
  },
  Price: {
    type: Number,
    require: [true, 'Booking Must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  Paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, functtion(next) {
    this.populate({
        Path: 'tour',
        select: 'name'
    })
});
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
