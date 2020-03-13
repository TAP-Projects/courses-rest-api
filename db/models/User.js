'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

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
		validate: { notNull: true, notEmpty: true },
		field: 'password'
	}
}

module.exports = function(sequelize) {
	class User extends Model {}
	User.init(options,{sequelize, modelName:'User'});
	User.associate = models => {
        User.hasMany(models.Course, {
            as: 'studentId', // alias
            foreignKey: {
                fieldName: 'studentId',
                allowNull: false,
            },
        });
    };
	return User
};
