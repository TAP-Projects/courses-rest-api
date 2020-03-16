// Handle route handlers asynchronously and with error handling. A wrapper around route handlers that will await their completion and catch any errors.
function asyncHandler(cb) {
    // Return an anonymous function that wraps the callback, passing in request, response, next
    return async (req,res,next) => {
        try {
            // Await the completion of the callback
            await cb(req,res,next);
        } catch (err) {
            next(err)
        }
    }
}

// Ensure the user is authenticated
function testAuth(req, res, next){
    // Get the authenticated user, which will only be set if authentication succeeded
    const user = req.currentUser;
    // If the user exists, then proceed
    //!NOTE: It's a good idea to use an if...else here, because, if we were to omit the else, Express would still call the second next() statement. You can avoid that by using return as in  if(user){ return next() }
    if (user) { 
        next() 
    } else { 
        next(newError(401, 'Access denied.'));
    }
}

// Ensure the user is authenticated
function mayUpdateDelete(){
    // Get the authenticated user, which will only be set if authentication succeeded
    if(req.currentUser.id === course.userId) { 
        next() 
    } else { 
        // Using return the exit the function
        return next(newError(401, 'Access denied.'));
    }
}

// Create a custom error
function newError(status, message) {
    // Create a new error instance
    const error = new Error();
    // Set the error status
    error.status = status;
    // Set the error message
    error.message = message;
    // return the error
    return error;
}

module.exports = [ asyncHandler, testAuth, newError ];
