const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const [validate, getUsers, getUserById, createUser, updateUser, destroyUser] = require("../controllers/user.js");

/**********************
 ***** USER ROUTES *****
 ***********************/

// GET /api/users 200 - Returns users
router.get("/", getUsers);

// GET /api/users/:id 200 - Returns single user
router.get("/:id", getUserById);


// POST /api/users 204 - Creates a user, sets the Location header to "/", and returns no content
router.post("/", createUser);

// PUT /api/users/:id 204 - Update a user, sets the Location header to "/", and returns no content
router.put("/:id", validate("user"), updateUser);

// DELETE /api/users/:id 204 - Delete a user, sets the Location header to "/", and returns no content
router.delete("/:id", destroyUser);

module.exports = router;