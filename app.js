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

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/ErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// start express app
const app = express();

app
  .enable('trust proxy')

  // ----------------------
  // 1) VIEW ENGINE SETUP
  // ----------------------
  .app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ----------------------
// 2) GLOBAL MIDDLEWARES
// ----------------------

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
});
app.use('/api', limiter);

// Body parser & cookies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

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

// ###################***********@@@@@@@@@@@@@@@@@@@@@@@@@************************#####################

// const path = require('path');
// const express = require('express');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const cookieParser = require('cookie-parser');

// const AppError = require('./utils/AppError');
// const globalErrorHandler = require('./controllers/ErrorController');
// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');
// const viewRouter = require('./routes/viewRoutes');

// const app = express();

// app.use(helmet());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       baseUri: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         'https://cdnjs.cloudflare.com',
//         'https://unpkg.com', // Leaflet CDN
//         "'unsafe-inline'", // Allow inline scripts (if absolutely needed)
//       ],
//       fontSrc: ["'self'", 'https:', 'data:'],
//       imgSrc: [
//         "'self'",
//         'data:',
//         'https://*.tile.openstreetmap.org',
//         'https://*.tile.thunderforest.com',
//       ],
//       objectSrc: ["'none'"],
//       styleSrc: [
//         "'self'",
//         'https:',
//         "'unsafe-inline'", // Needed by Leaflet for internal styles
//         'https://unpkg.com', // Leaflet CDN
//       ],
//       workerSrc: ["'self'", 'blob:'],
//       connectSrc: [
//         "'self'",
//         'ws://127.0.0.1:*', // Allow all WS ports in localhost
//       ],
//       // connectSrc:
//       //   process.env.NODE_ENV === 'development'
//       //     ? ["'self'", 'ws://127.0.0.1:*']
//       //     : ["'self'"], // Only allow WebSocket in dev,
//     },
//   }),
// );

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// // 1st GLOBAL MIDDLEWARE
// // Set security HTTP headers
// // Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// // Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP, please try again in an hour',
// });
// app.use('/api', limiter);
// // Body parser, reading data from the body into req.body
// app.use(express.json({ limit: '10kb' })); /*middleware*/
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());

// // Data sanitization against NOSQL query injection
// app.use(mongoSanitize());
// // Data sanitization against XSS
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price',
//     ],
//   }),
// );
// // Serving static files
// // app.use(express.static(`${__dirname}/public`)); changed
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve/redirect source maps and silence missing vendor maps to avoid noisy 404s
// app.get('/bundle.js.map', (req, res) => {
//   res.redirect(301, '/js/bundle.js.map');
// });

// app.get('/vendor/leaflet/leaflet.js.map', (req, res) => {
//   // Leaflet may not ship source maps; return empty 204 to silence 404s
//   res.status(204).end();
// });

// app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
//   res.status(204).end();
// });

// // app.use((req, res, next) => {
// //   console.log('Hello from the middleware 👋 ');
// //   next();
// // });

// // Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   // console.log(req.cookies);
//   next();
// });

// // app.get('/api/v1/tours', getAllTour);
// // app.get('/api/v1/tours/:id' /*params*/, getTour );
// // app.post('/api/v1/tours',postTour );
// // app.patch('/api/v1/tours/:id', updateTour );
// // app.delete('/api/v1/tours/:id', deleteTour);

// // 3rd ROUTES

// app.use('/', viewRouter);
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);
// app.use('/api/v1/bookings', bookingRouter);

// app.all('*', (req, res, next) => {
//   // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   // err.status = 'fail';
//   // err.statusCode = 404;
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

// module.exports = app;
