const { body } = require("express-validator");

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

module.exports = validate;