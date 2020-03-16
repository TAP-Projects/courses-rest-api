const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const [
	getUsers,
	getUserById,
	createUser,
	updateUser,
	destroyUser
] = require("../controllers/user.js");
const validate = require("../controllers/validate.js");
const authenticateUser = require("../controllers/authenticateUser.js");
const [asyncHandler, testAuth] = require("../controllers/helpers.js");

/**********************
 ***** USER ROUTES *****
 ***********************/

// GET /api/users 200 - Returns users
router.get(
	"/",
	asyncHandler(authenticateUser),
	testAuth,
	asyncHandler(getUsers)
);

// GET /api/users/:id 200 - Returns single user
router.get(
	"/:id",
	asyncHandler(authenticateUser),
	testAuth,
	asyncHandler(getUserById)
);

// POST /api/users 204 - Creates a user, sets the Location header to "/", and returns no content
router.post("/", asyncHandler(createUser));

// PUT /api/users/:id 204 - Update a user, sets the Location header to "/", and returns no content
router.put(
	"/:id",
	validate("user"),
    asyncHandler(authenticateUser),
    // This is superfluous on update and delete 
	testAuth,
	asyncHandler(updateUser)
);

// DELETE /api/users/:id 204 - Delete a user, sets the Location header to "/", and returns no content
router.delete(
	"/:id",
	asyncHandler(authenticateUser),
	// This is superfluous on update and delete 
    testAuth,
	asyncHandler(destroyUser)
);

module.exports = router;
