'use strict';
const Sequelize = require('sequelize');

const options = {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		field: 'id'
	},
	firstName: {
		type: Sequelize.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'firstName'
	},
	lastName: {
		type: Sequelize.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'lastName'
	},
	emailAddress: {
		type: Sequelize.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'emailAddress'
	},
	password: {
		type: Sequelize.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'password'
	}
}

module.exports = function(sequelize) {
	class Users extends Sequelize.Model {
		// Any methods go here
	}
	Users.init(options,{sequelize});
	// Users.associate = models => {
    //     Users.hasMany(models.Courses, {
    //         as: 'student', // alias
    //         foreignKey: {
    //             fieldName: 'studentId',
    //             allowNull: false,
    //         },
    //     });
    // };
	return Users
};
