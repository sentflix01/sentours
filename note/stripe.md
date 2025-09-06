I can see from the terminal output that you're experiencing several issues with your Node.js application:

1. **Stripe API Error**: The main error is related to Stripe's API version - you're using deprecated `line_items` properties
2. **Syntax Error**: There's a "Unexpected token '.'" error causing crashes
3. **Route Error**: There was a "Route.get() requires a callback function but got a [object Undefined]" error

Let me examine the current booking controller and related files to help fix these issues.

[3 tools called]

Now I can see the issues clearly. The main problem is in the `bookingController.js` file where you're using the deprecated Stripe API format. Let me fix the Stripe checkout session creation to use the new API format:

[1 tool called]

I can see the issue! The Stripe API has changed and you're using the deprecated `line_items` format. According to the error message, you need to use `line_items.price_data` instead of the old `amount`, `currency`, `name`, `description`, and `images` properties.

Let me fix the booking controller:

```javascript:controllers/bookingController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/AppError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
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
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
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
```

The key changes I made:

1. **Fixed Stripe API format**: Changed from the deprecated `amount`, `currency`, `name`, `description`, `images` properties to the new `price_data` structure
2. **Added `mode: 'payment'`**: This is required for the new Stripe API
3. **Wrapped with `catchAsync`**: This will properly handle any async errors and prevent the "UNHANDLED REJECTION" errors you're seeing
4. **Used `unit_amount`**: This replaces the old `amount` property

The new format uses:

- `price_data.currency` instead of `currency`
- `price_data.product_data.name` instead of `name`
- `price_data.product_data.description` instead of `description`
- `price_data.product_data.images` instead of `images`
- `price_data.unit_amount` instead of `amount`

This should resolve the Stripe API error you're seeing in the terminal. The syntax error might be related to other files, but let me know if you continue to see issues after this fix!
