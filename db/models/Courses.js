'use strict';
const Sequelize = require('sequelize');

const options = {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		field: 'id'
	},
	title: {
		type: Sequelize.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'title'
	},
	description: {
		type: Sequelize.TEXT,
		allowNull: false,
		defaultValue: '',
		field: 'description'
	},
	estimatedTime: {
		type: Sequelize.STRING(255),
		allowNull: true,
		field: 'estimatedTime'
	},
	materialsNeeded: {
		type: Sequelize.STRING(255),
		allowNull: true,
		field: 'materialsNeeded'
	}
}

module.exports = function(sequelize) {
	class Courses extends Sequelize.Model {
		// Any methods go here
	}
	Courses.init(options,{sequelize});
	// Courses.associate = models => {
    //     Courses.hasMany(models.Users, {
    //         as: 'student', // alias
    //         foreignKey: {
    //             fieldName: 'studentId',
    //             allowNull: false,
    //         },
    //     });
    // };
	return Courses
};
