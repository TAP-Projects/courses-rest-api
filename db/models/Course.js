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

	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
		validate: { notNull: true, notEmpty: true },
		field: 'title'
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: { notNull: true, notEmpty: true },
		field: 'description'
	},
	estimatedTime: {
		type: DataTypes.STRING(255),
		allowNull: true,
		validate: {},
		field: 'estimatedTime'
	},
	materialsNeeded: {
		type: DataTypes.STRING(255),
		allowNull: true,
		validate: { isAlphanumeric: true, },
		field: 'materialsNeeded'
	},
	userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
		// Course belongs to User 1:1
        references: {
			model: 'User',
			key: 'id'
		}
	}
}

module.exports = function(sequelize) {
	class Course extends Model {}
	Course.init(options,{sequelize});
	Course.associate = models => Course.belongsTo(models.User, {
		as: 'owner',
		foreignKey: {
			fieldName: 'userId',
			allowNull: false
		}
	});
	return Course
};
