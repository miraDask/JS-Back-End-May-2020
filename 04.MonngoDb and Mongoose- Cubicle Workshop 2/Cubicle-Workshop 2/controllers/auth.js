const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');

const { TOKEN_KEY } = require('../controllers/constants');

const generateToken = (username, userId) => {
	const data = {
		username,
		userID: userId
	};

	const token = jwt.sign(data, config.secret);
	return token;
};

const authenticationCheck = (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		req.isLoggedIn = false;
	}

	try {
		jwt.verify(token, config.secret);
		req.isLoggedIn = true;
	} catch (error) {
		req.isLoggedIn = false;
	}

	next();
};

const anonymousRestriction = (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		return res.redirect('/');
	}
	next();
};

const getUserId = (token) => {
	const { userID } = jwt.decode(token, config.secret);
	return userID;
};

module.exports = {
	generateToken,
	authenticationCheck,
	anonymousRestriction,
	getUserId
};
