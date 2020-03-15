const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const [validate, getCourses, getCourseById, createCourse, updateCourse, destroyCourse] = require("../controllers/course.js");

/**********************
 ***** COURSE ROUTES *****
 ***********************/

// GET /api/courses 200 - Returns users
router.get("/", getCourses);

// GET /api/courses/:id 200 - Returns single user
router.get("/:id", getCourseById);


// POST /api/courses 204 - Creates a user, sets the Location header to "/", and returns no content
router.post("/", createCourse);

// PUT /api/courses/:id 204 - Update a user, sets the Location header to "/", and returns no content
router.put("/:id", validate("course"), updateCourse);

// DELETE /api/courses/:id 204 - Delete a user, sets the Location header to "/", and returns no content
router.delete("/:id", destroyCourse);

module.exports = router;