const db = require('../db');
const models = db.models;
console.log("What is models right now? ", models);

async function getAll(model){
    const records = await db.models[model].findAll({order: [['createdAt', 'DESC']]});
    return records;
}

module.exports = [getAll]