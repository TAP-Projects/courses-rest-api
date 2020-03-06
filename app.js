'use strict';

// load modules
const express = require('express');
// Needed to test connection to db
const sequelize = require('./db').sequelize;
const morgan = require('morgan');
//const [getAll] = require('./controllers');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Testing the connection to the database
// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//   });


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

const db = require('./db');
const models = db.models;
// const { User, Course } = db.models
console.log("What is models right now? ", models);

async function getAll(model){
    const records = await User.findAll();
    return records;
    //return { ...db.models, "Did it work":"lets see" }
}

// GET /api/users 200 - Returns the currently authenticated user
app.get('/api/users', asyncHandler(async (req, res)=>{
    const users = await getAll("User");
    res.status(200).json(users);
  })
);

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

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
