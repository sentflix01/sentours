const stripe = require('stripe')(
  'sk_test_51S42GVERuPMAxoh9itjV5j1KRAZjjGhHhXZZ4dD811mDeVAKYOd0itfo2ZU0CdnA8fA3UAyy6yu12SPiHyLC6IN600YerrUhSY',
);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/AppError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 3) create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = async (session) => {
  try {
    const tour = session.client_reference_id;
    const user = await User.findOne({ email: session.customer_email });

    if (!user) {
      console.log('User not found for email:', session.customer_email);
      return;
    }

    const price = session.amount_total / 100; // FIXED: Use amount_total instead of display_items
    await Booking.create({ tour, user: user._id, price });

    console.log('Booking created successfully for user:', user.email);
  } catch (error) {
    console.log('Error creating booking:', error);
  }
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingCheckout(event.data.object); // FIXED: Added await
  }

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
