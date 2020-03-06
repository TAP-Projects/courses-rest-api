'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

const options = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true,
		field: 'id'
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: '',
		field: 'title'
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		defaultValue: '',
		field: 'description'
	},
	estimatedTime: {
		type: DataTypes.STRING(255),
		allowNull: true,
		field: 'estimatedTime'
	},
	materialsNeeded: {
		type: DataTypes.STRING(255),
		allowNull: true,
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
