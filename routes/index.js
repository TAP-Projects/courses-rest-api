const express = require('express');
const router = express.Router();
const [getUsers, getUserById] = require("../controllers");




/**********************
 ***** USER ROUTES *****
 ***********************/

// GET /api/users 200 - Returns users
router.get("/users", getUsers);

// GET /api/users/:id 200 - Returns single user
router.get("/users/:id", getUserById);


// // POST /api/users 204 - Creates a user, sets the Location header to "/", and returns no content
// router.post("/users",

// );

// // PUT /api/users/:id 204 - Update a user, sets the Location header to "/", and returns no content
// router.put(
// 	"/users/:id",
// 	asyncHandler(async (req, res) => {
	
// 			// Await the call to getAll, which wil return the user with the given id
// 			let user = await getAll("User", req.params.id);
// 			// If there is a user with that id, then
// 			if (user) {
// 				// Update the user object
// 				user = { ...user, ...req.body };
// 				// Await the call to updateUser, which updates the user in the database
// 				await updateUser(user);
// 				// Respond done
// 				res.status(204).end();
// 			// If there is no user with that id, then
// 			} else {
// 				// Respond with a 404
// 				res.status(404).json({ message: "User not found." });
// 			}
	
// 	})
// );

// // DELETE /api/users/:id 204 - Delete a user, sets the Location header to "/", and returns no content
// router.delete(
// 	"/users",
// 	asyncHandler(async (req, res) => {
	
// 			// Await the call to getAll, which wil return the user with the given id
// 			let user = await getAll("User", req.params.id);
// 			// If there is a user with that id, then
// 			if (user) {
// 				// Await the call to destroyUser, which will delete the user with the given id
// 				await destroyUser(user);
// 				// Respond done
// 				res.status(204).end();
// 			// If there is no user with that id, then
// 			} else {
// 				// Respond with a 404
// 				res.status(404).json({ message: "User not found." });
// 			}

// 	})
// );

/**********************
 ***** COURSE ROUTES ***
 ***********************/


module.exports = router;