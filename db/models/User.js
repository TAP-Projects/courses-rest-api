'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

//! I still need to add more specific validation to what I have below
const options = {

	firstName: {
		type: DataTypes.STRING(255),
		allowNull: false,
		validate: { notNull: true, notEmpty: true, isAlphanumeric: true, },
		field: 'firstName'
	},
	lastName: {
		type: DataTypes.STRING(255),
		allowNull: false,
		validate: {notNull: true, notEmpty: true, isAlphanumeric: true,},
		field: 'lastName'
	},
	emailAddress: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
		validate: {isEmail: true,},
		field: 'emailAddress'
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		validate: { notNull: true, notEmpty: true, isAlphanumeric: true, len: [8,16], },
		field: 'password'
	}
}

module.exports = function(sequelize) {
	class User extends Model {}
	User.init(options,{sequelize, modelName:'User'});
	User.associate = models => {
        User.hasMany(models.Course, {
            as: 'student', // alias
            foreignKey: {
                fieldName: 'studentId',
                allowNull: false,
            },
        });
    };
	return User
};
