'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

const options = {

	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},

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
		validate: { notNull: true, notEmpty: true },
		field: 'password'
	}
}

module.exports = function(sequelize) {
	class User extends Model {}
	User.init(options,{sequelize});
	User.associate = models => User.hasMany(models.Course, {
		as: 'owner',
		foreignKey: {
			fieldName: 'userId',
			allowNull: false
		}
	});
	return User
};
