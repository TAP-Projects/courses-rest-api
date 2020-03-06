const db = require('../db');
const models = db.models;
console.log("What is models right now? ", models);

async function getAll(model){
    const records = await db.models[model].findAll();
    return records;
    //return { ...db.models, "Did it work":"lets see" }
}

module.exports = [getAll]

//some options for findAll 
// {order: [['createdAt', 'DESC']]}