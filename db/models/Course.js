'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

const options = {

	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
		validate: { notNull: true, notEmpty: true, isAlphanumeric: true, },
		defaultValue: '',
		field: 'title'
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: { notNull: true, notEmpty: true, isAlphanumeric: true, },
		defaultValue: '',
		field: 'description'
	},
	estimatedTime: {
		type: DataTypes.STRING(255),
		allowNull: true,
		validate: { isNumeric: true },
		field: 'estimatedTime'
	},
	materialsNeeded: {
		type: DataTypes.STRING(255),
		allowNull: true,
		validate: { isAlphanumeric: true, },
		field: 'materialsNeeded'
	}
}

module.exports = function(sequelize) {
	class Course extends Model {}
	Course.init(options,{sequelize, modelName: 'Course'});
	Course.associate = models => {
        Course.belongsTo(models.User, {
            as: 'student', // alias
            foreignKey: {
                fieldName: 'studentId',
                allowNull: false,
            },
        });
    };
	return Course
};
