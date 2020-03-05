'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

const options = {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		field: 'id'
	},
	firstName: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'firstName'
	},
	lastName: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'lastName'
	},
	emailAddress: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'emailAddress'
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'password'
	}
}

module.exports = function(sequelize) {
	class User extends Model {}
	User.init(options,{sequelize, modelName:'User'});
	// User.associate = models => {
    //     User.hasMany(models.Course, {
    //         as: 'student', // alias
    //         foreignKey: {
    //             fieldName: 'studentId',
    //             allowNull: false,
    //         },
    //     });
    // };
	return User
};
