const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const [getCourses, getCourseById, createCourse, updateCourse, destroyCourse] = require("../controllers/course.js");
const validate = require("../controllers/validate.js")
const authenticateUser = require("../controllers/authenticateUser.js");
const [ asyncHandler, testAuth ] = require("../controllers/helpers.js")


/**********************
 ***** COURSE ROUTES *****
 ***********************/

// GET /api/courses 200 - Returns courses
router.get("/", asyncHandler(getCourses));

// GET /api/courses/:id 200 - Returns single course
router.get("/:id", asyncHandler(getCourseById));


// POST /api/courses 204 - Creates a user, sets the Location header to "/", and returns no content
router.post(
    "/", 
    asyncHandler(authenticateUser), 
    testAuth,
    asyncHandler(createCourse)
);

// PUT /api/courses/:id 204 - Update a user, sets the Location header to "/", and returns no content.
// Note: Only the put route requires express-validator. Sequelize captures other routes' errors.
router.put(
    "/:id", 
    validate("course"), 
    asyncHandler(authenticateUser),
    // This is superfluous on update and delete 
    testAuth, 
    asyncHandler(updateCourse)
);

// DELETE /api/courses/:id 204 - Delete a user, sets the Location header to "/", and returns no content
router.delete(
    "/:id", 
    asyncHandler(authenticateUser),
    // This is superfluous on update and delete 
    testAuth,
    asyncHandler(destroyCourse)
);

module.exports = router;