const bcryptjs = require('bcryptjs');
const { models } = require("../db");
const { User } = models;
const { body, validationResult } = require("express-validator");

// Retrieve all users from db and send as json
async function getUsers(req, res, next) {
	try {
		const users = await User.findAll();
		if (users) {
			res.status(200).json(users);
		} else {
			const err = new Error();
			err.status = 500;
			err.message = `No users found.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function getUserById(req, res, next) {
	try {
		// Await the call to getAll, which wil return the user with the given id
		const user = await User.findByPk(req.params.id);
		// If there is a user with that id, then
		if (user) {
			// Respond with the user data
			res.status(200).json(user);
			// If there is no user with that id, then
		} else {
			const err = new Error();
			err.status = 500;
			err.message = `No user with ID ${req.params.id}.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function createUser(req, res, next) {
	try {
		const user = req.body
		// Hash the password
		user.password = bcryptjs.hashSync(user.password)
		// Await the creation of the user in the database
		const newUser = await User.create(user);
		// Find the record that was just created
		const foundNewUser = await User.findByPk(newUser.id);
		if (foundNewUser) {
			// Respond "created"
			res.status(201).end();
		} else {
			const err = new Error();
			err.status = 500;
			err.message = `Failed to create user.`;
			next(err);
		}
	} catch (error) {
		next(error);
	}
}

async function updateUser(req, res, next) {
	// Finds the validation errors in this request and wraps them in an object with handy functions
	//!NOTE: This depends on the route having an array of checks
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	try {
		let user = await User.findByPk(req.params.id);
		// If user is found, then...
		if (user) {
            // Update the user object with new values and primary key
            //!NOTE: Not sure why it's necessary to set id explicitly like this, but it's necessary in order for the where option to work correctly
			user = { ...user, ...req.body, id:req.params.id };
            // Update the user in the db
            //!NOTE: Not sure why the where option is required
			await User.update(user, {where: {id:user.id}});
			// Respond "no-content"
			res.status(204).end();
			// If user is not found
		} else {
			// Create a new error
			const err = new Error();
			// Set status to 500
			err.status = 500;
			// Set custom message
			err.message = `Cannot update user. No user with ID ${req.params.id}.`;
			// Pass to global error handler
			next(err);
		}
	} catch (error) {
		// Pass to global error handler
		next(error);
	}
}

async function destroyUser(req, res, next) {
	try {
		let user = await User.findByPk(req.params.id);
		// If user is found, then...
		if (user) {
			// Update the user in the db
			User.destroy(user);
			// Respond "no-content"
			res.status(204).end();
			// If user is not found
		} else {
			// Create a new error
			const err = new Error();
			// Set status to 500
			err.status = 500;
			// Set custom message
			err.message = `Cannot update user. No user with ID ${req.params.id}.`;
			// Pass to global error handler
			next(err);
		}
	} catch (error) {
		// Pass to global error handler
		next(error);
	}
}

module.exports = [
	getUsers,
	getUserById,
	createUser,
	updateUser,
	destroyUser
];
