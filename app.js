const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/ErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

// start express app
const app = express();

// Trust proxy for deployment (Render, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ----------------------
// 1) VIEW ENGINE SETUP
// ----------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ----------------------
// 2) GLOBAL MIDDLEWARES
// ----------------------

// IMPLEMENT CORS
app.use(cors());
// Access-Control-Allow-origin *
// api.natours.com,  front-end natours.com
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   }),
// );
app.options('*', cors());
//app.options('/api/v1/tours/:id', cors())
// Security HTTP headers (CSP disabled for smooth dev with Leaflet/Stripe)
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Body parser & cookies from the body
app.use(express.json({ limit: '10kb' }));
// Body parser & cookies from the urlencoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Body parser & cookies from the cookieParser
app.use(cookieParser());

// Data sanitization from the mongoSanitize
app.use(mongoSanitize());
// Data sanitization from the xss
app.use(xss());
// Data sanitization from the hpp

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------
// 3) EXTRA ROUTES
// ----------------------

// Silence source-map 404s (optional, helps dev tools)
app.get('/bundle.js.map', (req, res) => {
  res.redirect(301, '/js/bundle.js.map');
});

app.get('/vendor/leaflet/leaflet.js.map', (req, res) => {
  res.status(204).end();
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ----------------------
// 4) ROUTES
// ----------------------
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// ----------------------
// 5) ERROR HANDLING
// ----------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
