
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./Routes/tourRoutes')
const userRouter = require('./Routes/userRoutes')

const app = express();
// 1st MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json()); /*middleware*/
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋 ');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});



// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id' /*params*/, getTour );
// app.post('/api/v1/tours',postTour );
// app.patch('/api/v1/tours/:id', updateTour );
// app.delete('/api/v1/tours/:id', deleteTour);

// 3rd ROUTES



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4TH START SERVER

module.exports = app