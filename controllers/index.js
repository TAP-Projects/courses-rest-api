const { models } = require('../db');
const { User, Course } = models;
//console.log("What is in models right now? ", Object.keys(models));

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

async function createUser(data){
    try{
        const newUser = await User.create(data);
        return newUser
    }
    catch(error){
        throw error;
    }
}

async function createCourse(data){
    try{
        const newCourse = await Course.create(data);
        return newCourse;
    }
    catch(error){
        throw error ;
    }
}

async function updateUser(userId){
    try{
        const theUser = await User.findByPk(userId);
        // make update
        return theUser
    }
    catch(error){
        throw error;
    }
}

async function updateCourse(courseId){
    try{
        const theCourse = await Course.create(courseId);
        // make update
        return theCourse;
    }
    catch(error){
        throw error ;
    }
}

async function deleteUser(userId){
    try{
        const theUser = await User.findByPk(userId);
        // delete
        return true
    }
    catch(error){
        throw error;
    }
}

async function deleteCourse(courseId){
    try{
        const theCourse = await Course.create(courseId);
        // make update
        return true
    }
    catch(error){
        throw error ;
    }
}

module.exports = [getAll, createUser, createCourse]

//some options for findAll 
// {order: [['createdAt', 'DESC']]}