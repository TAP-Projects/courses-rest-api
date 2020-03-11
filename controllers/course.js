//!TODO: Extract the try catch statement as a separate wrapper function (asyncHandler)
//!TODO: Extract a newError function into which I can pass a status and message
//!TODO: Extract the if...else authentication statement as a separate wrapper function

const bcryptjs = require("bcryptjs");
const { models } = require("../db");
const { Course } = models;
const { body, validationResult } = require("express-validator");

// Retrieve all users from db and send as json
async function getCourses(req, res, next) {
	try {
		const courses = await Course.findAll();
		if (courses.length > 0) {
			res.status(200).json(courses);
		} else {
			const err = new Error();
			err.status = 500;
			err.message = `No courses found.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function getCourseById(req, res, next) {
	try {
		// Await the call to getAll, which will return the user with the given id
		const course = await Course.findByPk(req.params.id);
		// If there is a user with that id, then
		if (course) {
			// Respond with the user data
			res.status(200).json(course);
			// If there is no user with that id, then
		} else {
			const err = new Error();
			err.status = 500;
			err.message = `No course with ID ${req.params.id}.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function createCourse(req, res, next) {
	try {
		// Get the authenticated user, which will only be set if authentication succeeded
		const user = req.currentUser;
		// If the user exists, then proceed
		if (user) {
			// Await the creation of the user in the database
			const newCourse = await Course.create(req.body);
			// Find the record that was just created
			const foundNewCourse = await Course.findByPk(newCourse.id);
			if (foundNewCourse) {
				// Respond "created"
				res.status(201).end();
			} else {
				const err = new Error();
				err.status = 500;
				err.message = `Failed to create course.`;
				next(err);
			}
		} else {
			const err = new Error();
			err.status = 401;
			err.message = `Access denied.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function updateCourse(req, res, next) {
	
	// Finds the validation errors in this request and wraps them in an object with handy functions
	//!NOTE: This depends on the update route having an array of checks
	const errors = validationResult(req);
	// If there are errors
	if (!errors.isEmpty()) {
		// Respond with status 422 and an array of the errors. 
		return res.status(422).json({ errors: errors.array() });
	}

	try {
		// Get the authenticated user, which will only be set if authentication succeeded
		const user = req.currentUser;
		// If the user exists, then proceed
		if (user) {
			let course = await Course.findByPk(req.params.id);
			// If user is found, then...
			if (course) {
				// Update the user object with new values and primary key
				//!NOTE: Not sure why it's necessary to set id explicitly like this, but it's necessary in order for the where option to work correctly
				course = { ...course, ...req.body, id: req.params.id };
				// Update the user in the db
				//!NOTE: Not sure why the where option is required
				await Course.update(course, { where: { id: course.id } });
				// Respond "no-content"
				res.status(204).end();
				// If user is not found
			} else {
				// Create a new error
				const err = new Error();
				// Set status to 500
				err.status = 500;
				// Set custom message
				err.message = `Cannot update course. No course with ID ${req.params.id}.`;
				// Pass to global error handler
				next(err);
			}
		} else {
			const err = new Error();
			err.status = 401;
			err.message = `Access denied.`;
			next(err);
		}
	} catch (error) {
		// Pass to global error handler
		next(error);
	}
}

async function destroyCourse(req, res, next) {
	try {
		// Get the authenticated user, which will only be set if authentication succeeded
		const user = req.currentUser;
		// If the user exists, then proceed
		if (user) {
			let course = await Course.findByPk(req.params.id);
			// If user is found, then...
			if (course) {
				// Update the user in the db
				Course.destroy(course);
				// Respond "no-content"
				res.status(204).end();
				// If user is not found
			} else {
				// Create a new error
				const err = new Error();
				// Set status to 500
				err.status = 500;
				// Set custom message
				err.message = `Cannot delete course. No course with ID ${req.params.id}.`;
				// Pass to global error handler
				next(err);
			}
		} else {
			const err = new Error();
			err.status = 401;
			err.message = `Access denied.`;
			next(err);
		}
	} catch (error) {
		// Pass to global error handler
		next(error);
	}
}

module.exports = [
	getCourses,
	getCourseById,
	createCourse,
	updateCourse,
	destroyCourse
];
