"use strict";

// load modules
const express = require("express");
// Needed to test connection to db
const sequelize = require("./db").sequelize;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const [getAll, createUser, updateUser, destroyUser, createCourse, updateCourse, destroyCourse] = require("./controllers");

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
		// Catch any errors
		try {
			// Await the call to getAll, which will return all users
			const users = await getAll("User");
			// If there are users, then
			if (users.length > 0) {
				// Respond with the user data
				res.status(200).json(users);
			// If there are no users, then
			} else {
				// Respond with a 404
				res.status(404).json({ message: "No users found." });
			}
		// If there's an error, respond with a server error message
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	})
);

// GET /api/users/:id 200 - Returns single user
app.get(
	"/api/users/:id",
	asyncHandler(async (req, res) => {
		// Catch any errors
		try {
			// Await the call to getAll, which wil return the user with the given id
			const user = await getAll("User", req.params.id);
			// If there is a user with that id, then
			if (user) {
				// Respond with the user data
				res.status(200).json(user);
			// If there is no user with that id, then
			} else {
				// Respond with a 404
				res.status(404).json({ message: "User not found." });
			}
		// If there's an error, respond with a server error message
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	});
);

// POST /api/users 204 - Creates a user, sets the Location header to "/", and returns no content
app.post(
	"/api/users",
	asyncHandler(async (req, res) => {
		// Await the call to createUser, which will create a new user in the database with the given object
		//!NOTE: Where will error handling take place?
		await createUser(req.body);
		// Respond done
		res.status(204).end();
	})
);

// PUT /api/users/:id 204 - Update a user, sets the Location header to "/", and returns no content
app.put(
	"/api/users/:id",
	asyncHandler(async (req, res) => {
		// Catch any errors
		try {
			// Await the call to getAll, which wil return the user with the given id
			let user = await getAll("User", req.params.id);
			// If there is a user with that id, then
			if (user) {
				// Update the user object
				user = { ...user, ...req.body };
				// Await the call to updateUser, which updates the user in the database
				await updateUser(user);
				// Respond done
				res.status(204).end();
			// If there is no user with that id, then
			} else {
				// Respond with a 404
				res.status(404).json({ message: "User not found." });
			}
		// If there's an error, respond with a server error message
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	})
);

// DELETE /api/users/:id 204 - Delete a user, sets the Location header to "/", and returns no content
app.delete(
	"/api/users",
	asyncHandler(async (req, res) => {
		// Catch any errors
		try {
			// Await the call to getAll, which wil return the user with the given id
			let user = await getAll("User", req.params.id);
			// If there is a user with that id, then
			if (user) {
				// Await the call to destroyUser, which will delete the user with the given id
				await destroyUser("User", req.params.id);
				// Respond done
				res.status(204).end();
			// If there is no user with that id, then
			} else {
				// Respond with a 404
				res.status(404).json({ message: "User not found." });
			}
		// If there's an error, respond with a server error message
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
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
		try {
			// Get the course
			let course = await getAll("Course", req.params.id);
			// If there is a course with that id, then
			if (course) {
				// Update the course object
				course = { ...course, ...req.body };
				// Update the course in the database
				await updateCourse(course);
				// Respond done
				res.status(204).end();
			// If there isn't a course with that id, then
			} else {
				// Respond with a 404
				res.status(404).json({ message: "Course not found." });
			}
		// Catch any errors
		} catch (err) {
			// Respond with a server error message
			res.status(500).json({ message: err.message });
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
