const { models } = require("../db");
const { User } = models;
const { body, validationResult } = require("express-validator");

// Express-Validator validation
//!NOTE: PUT routes do NOT use Sequelize's built in validation. That's why we're using express-validator here. POST routes do use Sequelize for validation, so no other validation is necessary. See model definitions for validation details.
function validate(model) {
	switch (model) {
		case "user": {
			return [
				body("firstName", "Provide a first name.")
					.exists({ checkNull: true, checkFalsy: true })
					.isString()
					.trim(),
				body("lastName", "Provide a last name.")
					.exists({ checkNull: true, checkFalsy: true })
					.isString()
					.trim(),
				body("emailAddress", "Invalid email")
					.exists({ checkNull: true, checkFalsy: true })
					.isEmail()
					.normalizeEmail(),
				body("password")
					.exists({ checkNull: true, checkFalsy: true })
					.isString()
					.trim()
			];
		}
		case "course": {
			return [
				body("title", "Provide a course title.")
					.exists({ checkNull: true, checkFalsy: true })
					.isString()
					.trim(),
				body("description", "Provide a course description.")
					.exists({ checkNull: true, checkFalsy: true })
					.isString()
					.trim(),
				body("estimatedTime", "Provide an estimated time.")
					.isString()
					.trim(),
                body("materialsNeeded", "Text only.")
                    .isString()
                    .trim()
			];
		}
	}
}

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
		// Await the creation of the user in the database
		const newUser = await User.create(req.body);
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
	validate,
	getUsers,
	getUserById,
	createUser,
	updateUser,
	destroyUser
];
