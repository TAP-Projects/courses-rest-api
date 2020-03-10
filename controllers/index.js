const { models } = require("../db");
const { User, Course } = models;
const { body } = require("express-validator");


//!NOTE: PUT routes do NOT use Sequelize's built in validation. That's why we're using express-validator here. POST routes do use Sequelize for validation, so no other validation is necessary. See model definitions for validation details.

// Express-Validator validation
exports.validate = method => {
	switch (method) {
		case "validateUser": {
			return [
				body("firstName", "Provide a first name.").exists().trim().not().isEmpty(),
				body("lastName", "Provide a last name.").exists().trim().not().isEmpty(),
				body("emailAddress", "Invalid email").exists().not().isEmpty().isEmail().normalizeEmail(),
				body("password").exists().trim().not().isEmpty(),
			];
		}
		case "validateCourse": {
			return [
				body("title", "Provide a course title.").exists().trim().not().isEmpty(),
				body("description", "Provide a course description.").exists().trim().not().isEmpty(),
				body("estimatedTime", "Provide an estimated time.").exists().trim().not().isEmpty(),
				body(
					"materialsNeeded",
					"Provide a list of materials needed."
				),
			];
		}
	}
};

// A function to wrap route handlers in a try catch block and execute a callback asynchronously
//! Does async handler itself need to be async given how i'm using it?
async function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

// async function getOneOrMany(model, id) {
//     if (model && id) {
//         const record = await models[model].findByPk(id);
//         return record;
//     } else if (model) {
//         const records = await models[model].findAll();
//         return records;
//     }
// }

// Retrieve all users from db and send as json
async function getUsers(req, res, next) {
    try { 
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        next(err)
    }
    // async function inner(req,res,next){
        // Await the call to getAll, which will return all users
        // If there are users, then
        //if (users) {
            // Respond with the user data
        // If there are no users, then
        // } else {
        //     const err = new Error();
        //     err.status = 500;
        //     err.message = "No users found."
        //     next(err);
        // }
    // }
    // //! Do I need to await async handler running and returning it's callback?
    // const cb = await asyncHandler(inner);
    // return cb
}

function getUserById(req, res, next) {
    async function inner(req, res, next) {
        // Await the call to getAll, which wil return the user with the given id
        const user = {blah:"blah"}//await getOneOrMany("User", req.params.id);
        // If there is a user with that id, then
        if (user) {
            // Respond with the user data
            res.status(200).json(user);
        // If there is no user with that id, then
        } else {
            const err = new Error();
            err.status = 500;
            err.message = `User ${id} not found.`
            next(err);
        }
    }
    const cb = await asyncHandler(inner);
    return cb
}

// async function createUser() {
//     return asyncHandler(async (req, res, next) => {
// 		// Await the call to createUser, which will create a new user in the database with the given object
//         await User.create(data);
// 		// Respond "created"
// 		res.status(201).end();
// 	})
// }

// async function updateUser(userObject) {
// 	try {
// 		User.update(user);
// 		//const theUser = await User.findByPk(userId);
// 		//return theUser
// 	} catch (error) {
// 		throw error;
// 	}
// }

// async function destroyUser(userObject) {
// 	try {
// 		await User.destroy(userObject);
// 	} catch (error) {
// 		throw error;
// 	}
// }

// async function createCourse(data) {
// 	try {
// 		const newCourse = await Course.create(data);
// 		return newCourse;
// 	} catch (error) {
// 		throw error;
// 	}
// }

// async function updateCourse(courseId) {
// 	try {
// 		const theCourse = await Course.create(courseId);
// 		//! Update database
// 		return theCourse;
// 	} catch (error) {
// 		throw error;
// 	}
// }

// async function destroyCourse(courseObject) {
// 	try {
// 		const theCourse = await Course.destroy(courseObject);
// 		//! Destroy record in database
// 		return true;
// 	} catch (error) {
// 		throw error;
// 	}
// }

module.exports = [
    getUsers,
    getUserById
];

//some options for findAll
// {order: [['createdAt', 'DESC']]}
