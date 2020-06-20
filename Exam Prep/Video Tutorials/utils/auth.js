const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const courseService = require('../services/courses');
const { TOKEN_KEY, USERNAME } = require('../controllers/constants');

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
	const username = req.cookies[USERNAME];

	if (!token) {
		req.isLoggedIn = false;
	}

	try {
		jwt.verify(token, config.secret);
		req.isLoggedIn = true;
		req.username = username;
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

const isCreatorCheck = async (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		req.isCreator = false;
	}

	try {
		const courseId = req.params.id;
		const creatorId = await courseService.getCreator(courseId);
		const { userID } = jwt.decode(token, config.secret);

		req.isCreator = creatorId === userID;
	} catch (error) {
		req.isCreator = false;
	}

	next();
};

const isEnrolledCheck = async (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		req.isEnrolled = false;
	}

	try {
		const courseId = req.params.id;
		const { userID } = jwt.decode(token, config.secret);

		req.isEnrolled = await courseService.IsUserEnrolled(courseId, userID);
	} catch (error) {
		req.isEnrolled = false;
	}

	next();
};

const notCreatorRestriction = async (req, res, next) => {
	try {
		const token = req.cookies[TOKEN_KEY];
		const courseId = req.params.id;
		const creatorId = await await courseService.getCreator(courseId);
		const { userID } = jwt.decode(token, config.secret);

		if (creatorId === userID) {
			next();
		} else {
			return res.redirect('/');
		}
	} catch (error) {
		return res.redirect('/');
	}
};

module.exports = {
	generateToken,
	authenticationCheck,
	anonymousRestriction,
	getUserId,
	isCreatorCheck,
	notCreatorRestriction,
	isEnrolledCheck
};
