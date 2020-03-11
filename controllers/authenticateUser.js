const auth = require("basic-auth");

async function authenticateUser(req, res, next) {

	// Parse the user's credentials from the Authorization header.
	const credentials = auth(req);
    
    // If the user's credentials are available...
	if (credentials) {
		// Attempt to retrieve the user from the db by email address. The email was supplied as the user's "key" in the Authorization header, but in credentials, it's stored as credentials.name.
		const user = await User.findAll({
			where: { emailAddress: credentials.name }
		});

		// If a user was successfully retrieved from the data store...
		if (user) {
            // Use the bcryptjs to compare the user's password (from the Authorization header) to the user's password that was retrieved from the data store. compareSync will hash the password from the header before the comparison. 
            //? How does bcryptjs know what seed to use when hashing the password it got from the authorization header?
			const authenticated = bcryptjs.compareSync(
				credentials.pass,
				user.password
			);

			// If the passwords match...
			if (authenticated) {
				// Then store the retrieved user object on the request object so any middleware functions that follow this middleware function will have access to the user's information.
				req.currentUser = user;
			} else {
				message = `Authentication failure for username: ${user.emailAddress}`;
			}
		} else {
			message = `User not found for username: ${credentials.name}`;
		}
	} else {
		message = "Auth header not found";
	}

	// If user authentication failed...
	if (message) {
		console.warn(message);

		// Return a response with a 401 Unauthorized HTTP status code.
		res.status(401).json({ message: "Access Denied" });
	} else {
		// Or if user authentication succeeded...
		// Call the next() method.
		next();
	}
}

module.exports = authenticateUser;
