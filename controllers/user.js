const bcryptjs = require("bcryptjs");
const { models } = require("../db");
const { User } = models;
const { body, validationResult } = require("express-validator");
const [newError] = require("../controllers/helpers");

// Retrieve all users from db and send as json
async function getUsers(req, res, next) {
	const users = await User.findAll({
		attributes: { exclude: ['password', 'updatedAt', 'createdAt'] }
	});
	if (users) {
		res.status(200).json(users);
	} else {
		const err = newError(500, "No users found.");
		next(err);
	}
}

async function getUserById(req, res, next) {
	// Await the call to getAll, which wil return the user with the given id
	const user = await User.findByPk(req.params.id, {
		attributes: { exclude: ['password', 'updatedAt', 'createdAt'] }
	});
	// If there is a user with that id, then
	if (user) {
		// Respond with the user data
		res.status(200).json(user);
		// If there is no user with that id, then
	} else {
		const err = newError(500, `No user with ID ${req.params.id}.`);
		next(err);
	}
}

async function createUser(req, res, next) {
	const user = req.body;
	// Hash the password
	user.password = bcryptjs.hashSync(user.password);
	// Await the creation of the user in the database
	const newUser = await User.create(user);
	// Find the record that was just created
	const foundNewUser = await User.findByPk(newUser.id);
	if (foundNewUser) {
		// Respond "created"
		res.status(201)
			.set("Location", `${foundNewUser.id}`)
			.end();
	} else {
		const err = newError(500, "Failed to create user.");
		next(err);
	}
}

async function updateUser(req, res, next) {
	// Finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	// Await finding the user in the db
	let user = await User.findByPk(req.params.id);
	
	// Exit if not authorized to update. Get the authenticated user, which will only be set if authentication succeeded, and make sure that that's the person who owns this user profile.
    if(req.currentUser.id !== user.id) { 
        return next(newError(401, 'Access denied. User may not update or delete this user.'));
	}

	// If user is found, then...
	if (user) {
		// Update the user object with new values and primary key
		user = { ...user, ...req.body, id: req.params.id };
		// Update the user in the db
		await User.update(user, { where: { id: user.id } });
		// Respond "no-content"
		res.status(204).end();
		// If user is not found
	} else {
		// Create a new error
		const err = newError(
			500,
			`Cannot update user. No user with ID ${req.params.id}.`
		);
		// Send the error to the global error handler
		next(err);
	}
}

async function destroyUser(req, res, next) {
	let user = await User.findByPk(req.params.id);
	// Check for ownership, if owned, proceed
	mayUpdateDelete();
	// If user is found, then...
	if (user) {
		// Update the user in the db
		User.destroy({ where: { id: user.id } });
		// Respond "no-content"
		res.status(204).end();
		// If user is not found
	} else {
		// Create a new error
		const err = newError(
			500,
			`Cannot delete. No user with ID ${req.params.id}.`
		);
		// Pass to global error handler
		next(err);
	}
}

module.exports = [getUsers, getUserById, createUser, updateUser, destroyUser];
