'use strict';

// load modules
const express = require('express');
// Needed to test connection to db
const sequelize = require('./db').sequelize;
const morgan = require('morgan');
const [getAll] = require('./controllers');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Testing the connection to the database
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


function asyncHandler(cb){
  return async (req,res, next) => {
      try {
          await cb(req, res, next);
      } catch(err) {
          next(err);
      }
  }
}

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

/**********************
***** USER ROUTES *****
***********************/

// GET /api/users 200 - Returns users
app.get('/api/users', asyncHandler(async (req, res)=>{
    const users = await getAll("User");
    res.status(200).json(users);
  })
);

// GET /api/users/:id 200 - Returns single user
app.get('/api/users/:id', asyncHandler(async (req, res)=>{
    const user = await getAll("User", req.params.id);
    res.status(200).json(user);
  })
);

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

/**********************
***** COURSE ROUTES ***
***********************/

// GET /api/courses 200 - Returns the courses
app.get('/api/courses', asyncHandler(async (req, res)=>{
  const courses = await getAll("Course");
  res.status(200).json(courses);
})
);

// GET /api/courses/:id 200 - Returns single course
app.get('/api/courses/:id', asyncHandler(async (req, res)=>{
  const course = await getAll("Course", req.params.id);
  res.status(200).json(course);
})
);

// POST /api/courses 201 - Creates a course, sets the Location header to "/", and returns no content

/**********************
***** ERROR ROUTES ****
***********************/

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    error: {},
  });
});

module.exports = app;
