'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};
db.models = [];

// Instantiate a Sequelize instance called 'sequelize' and pass in the appropriate configuration options
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models into our Sequelize instance
fs
  // Synchronously read all files in the directory containing the currently executing file. We need to use path.join to append the 'models' directory to the path.
  .readdirSync(path.join(__dirname, 'models'))
  // Filter down to js files
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // For each js file, sequelize.import it, passing in the absolute path to the file, and then add the model to the db as a new property on the db
  .forEach(file => {
    console.info(`Importing database model from file: ${file}`);
    // Import the model and save a reference to that. Again, use path.join to append the model directory to the absolute path containing this index.js file, before finally appending the file
    const model = sequelize['import'](path.join(__dirname, 'models', file));
    // Add the model to db as a new property at model.name
    db.models[model.name] = model;
  });

  // For each model in db, call associate on that model
  const models = db.models
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Add the Sequelize instance to db
db.sequelize = sequelize;
// Add Sequelize to db
db.Sequelize = Sequelize;

module.exports = db;
