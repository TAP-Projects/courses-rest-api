const bcryptjs = require("bcryptjs");
const { models } = require("../db");
const { Course } = models;
const { body, validationResult } = require("express-validator");
const [newError] = require("../controllers/helpers");

// Retrieve all users from db and send as json
async function getCourses(req, res, next) {
	const courses = await Course.findAll({
		attributes: { include: 'User', exclude: ['updatedAt', 'createdAt'] }
	});
	if (courses.length > 0) {
		res.status(200).json(courses);
	} else {
		const err = newError(500, "No courses found.");
		next(err);
	}
}

async function getCourseById(req, res, next) {
	// Await the call to getAll, which will return the user with the given id
	const course = await Course.findByPk(req.params.id, {
		attributes: { include: 'User', exclude: ['updatedAt', 'createdAt'] }
	});
	// If there is a user with that id, then
	if (course) {
		// Respond with the user data
		res.status(200).json(course);
		// If there is no user with that id, then
	} else {
		// Create a new error and pass it on to the global error handler
		const err = newError(500, `No course with ID ${req.params.id}.`);
		next(err);
	}
}

async function createCourse(req, res, next) {
	// Await the creation of the user in the database
	const newCourse = await Course.create(req.body);
	// Find the record that was just created
	const foundNewCourse = await Course.findByPk(newCourse.id);
	if (foundNewCourse) {
		// Respond "created", and set the header's location
		res.status(201)
			.set("Location", `/${foundNewCourse.id}`)
			.end();
	} else {
		const err = newError(500, "Failed to create course.");
		next(err);
	}
}

async function updateCourse(req, res, next) {
	// Finds the validation errors provided by the check function in this request and wraps them in an object
	const errors = validationResult(req);
	// If there are errors
	if (!errors.isEmpty()) {
		// Respond with status 422 and an array of the errors.
		return res.status(422).json({ errors: errors.array() });
	}
	// Find the course in the db
	let course = await Course.findByPk(req.params.id);
	// Check for ownership, if owned, proceed
	mayUpdateDelete();
	// If course found, then...
	if (course) {
		// Update the course object with new values and primary key
		course = { ...course, ...req.body, id: req.params.id };
		// Update the course in the db
		await Course.update(course, { where: { id: course.id } });
		// Respond "no-content"
		res.status(204).end();
		// If course not found
	} else {
		// Create a new error with status and message
		const err = newError(
			500,
			`Cannot update. No course with ID ${req.params.id}.`
		);
		// Pass error to global error handler
		next(err);
	}
}

async function destroyCourse(req, res, next) {
	// Get the course from the db
	let course = await Course.findByPk(req.params.id);
	// Check for ownership, if owned, proceed
	mayUpdateDelete();
	// If found, then...
	if (course) {
		// Destroy it in the db
		Course.destroy({ where: { id: course.id } });
		// Respond "no-content"
		res.status(204).end();
		// If user is not found
	} else {
		// Create a new error
		const err = newError(
			500,
			`Cannot delete. No course with ID ${req.params.id}.`
		);
		// Pass to global error handler
		next(err);
	}
}

module.exports = [
	getCourses,
	getCourseById,
	createCourse,
	updateCourse,
	destroyCourse
];
