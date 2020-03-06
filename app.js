"use strict";

// load modules
const express = require("express");
// Needed to test connection to db
const sequelize = require("./db").sequelize;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const [getAll, createUser, createCourse] = require("./controllers");

// variable to enable global error logging
const enableGlobalErrorLogging =
	process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// For HTTP request logging
app.use(morgan("dev"));
// Easy access to request.body
app.use(bodyParser.json());

// Testing the connection to the database
sequelize
	.authenticate()
	.then(function(err) {
		console.log("Connection has been established successfully.");
	})
	.catch(function(err) {
		console.log("Unable to connect to the database:", err);
	});

function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

//!NOTE: Need try catch error handling that will respond with something like res.json({"message": error.message})

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the REST API project!"
	});
});

/**********************
 ***** USER ROUTES *****
 ***********************/

// GET /api/users 200 - Returns users
app.get(
	"/api/users",
	asyncHandler(async (req, res) => {
		const users = await getAll("User");
		res.status(200).json(users);
	})
);

// GET /api/users/:id 200 - Returns single user
app.get(
	"/api/users/:id",
	asyncHandler(async (req, res) => {
		const user = await getAll("User", req.params.id);
		res.status(200).json(user);
	})
);

// POST /api/users 204 - Creates a user, sets the Location header to "/", and returns no content
app.post(
	"/api/users",
	asyncHandler(async (req, res) => {
		await createUser(req.body);
		res.status(204).end();
	})
);

// PUT /api/users/:id 204 - Update a user, sets the Location header to "/", and returns no content
app.put(
	"/api/users/:id",
	asyncHandler(async (req, res) => {
		try{
      let user = await getAll("User", req.params.id);
      if (user) {
        user = {...user, ...req.body};
		    await updateUser(user);
        res.status(204).end();
      } else {
        res.status(404).json({message: "User not found."});
      }
    } catch(err){
      res.status(500).json({message: err.message})
    }
	})
);

// DELETE /api/users/:id 204 - Delete a user, sets the Location header to "/", and returns no content
app.delete(
	"/api/users",
	asyncHandler(async (req, res) => {
		const user = await updateUser("User", req.params.id);
		// ??? something something something
		res.status(204).end();
	})
);

/**********************
 ***** COURSE ROUTES ***
 ***********************/

// GET /api/courses 200 - Returns the courses
app.get(
	"/api/courses",
	asyncHandler(async (req, res) => {
		const courses = await getAll("Course");
		res.status(200).json(courses);
	})
);

// GET /api/courses/:id 200 - Returns single course
app.get(
	"/api/courses/:id",
	asyncHandler(async (req, res) => {
		const course = await getAll("Course", req.params.id);
		res.status(200).json(course);
	})
);

// POST /api/courses 201 - Creates a course, sets the Location header to "/", and returns no content
app.post(
	"/api/courses",
	asyncHandler(async (req, res) => {
		await createCourse(req.body);
		res.status(204).end();
	})
);

// PUT /api/courses/:id 204 - Update a course, sets the Location header to "/", and returns no content
app.put(
	"/api/courses/:id",
	asyncHandler(async (req, res) => {
		try{
      let course = await getAll("Course", req.params.id);
      if (course) {
        course = {...course, ...req.body};
		    await updateCourse(course);
        res.status(204).end();
      } else {
        res.status(404).json({message: "Course not found."});
      }
    } catch(err){
      res.status(500).json({message: err.message})
    }
	})
);

/**********************
 ***** ERROR ROUTES ****
 ***********************/

// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json({
		message: "Route Not Found"
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
		error: {}
	});
});

module.exports = app;
