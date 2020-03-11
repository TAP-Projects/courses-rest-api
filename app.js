"use strict";
const express = require("express");
const sequelize = require("./db").sequelize;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

// variable to enable global error logging
const enableGlobalErrorLogging =
	process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// For HTTP request logging
app.use(morgan("dev"));
// For access to request.body
app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the REST API project!"
	});
});

// Api routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Test connection to db
sequelize
	.authenticate()
	.then(function(err) {
		console.log("Connection has been established successfully.");
	})
	.catch(function(err) {
		console.log("Unable to connect to the database:", err);
	});

/**********************
 ***** ERROR ROUTES ****
 ***********************/

// Catch unmatched routes, set status, and pass on to global error handler
app.use((req, res, next) => {
	const err = new Error("Not found");
	err.status = 404
	next(err);
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
