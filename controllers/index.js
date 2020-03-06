const { models } = require('../db');
console.log("What is in models right now? ", Object.keys(models));

async function getAll(model, id){
    try{
        if(id){
            const record = await models[model].findByPk(id);
            return record;
        } else {
            const records = await models[model].findAll();
            return records;
        }
    }
    catch(error){
        throw error;
    }
}

async function createUser(){
    try{
        return 'blah'
    }
    catch{
        throw error;
    }
}

async function createCourse(){
    try{
        return 'blah';
    }
    catch{
        throw error ;
    }
}

module.exports = [getAll, createUser, createCourse]

//some options for findAll 
// {order: [['createdAt', 'DESC']]}