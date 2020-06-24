const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const service = require('../services/example');
const userService = require('../services/users');
const { TOKEN_KEY } = require('../controllers/constants');

const generateToken = (username, userId) => {
	const data = {
		username,
		userID: userId
	};

	const token = jwt.sign(data, config.secret);
	return token;
};

const authenticationCheck = async (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		req.isLoggedIn = false;
	}

	try {
		jwt.verify(token, config.secret);
		const id = getUserId(token);
		const { email, _id, username } = await userService.getById(id);
		req.user = { email, _id: _id.toString(), username };
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

const isCreatorCheck = async (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		req.isCreator = false;
	}

	try {
		const id = req.params.id;
		const creatorId = await service.getCreator(id);
		const { userID } = jwt.decode(token, config.secret);

		req.isCreator = creatorId === userID;
	} catch (error) {
		req.isCreator = false;
	}

	next();
};

const notCreatorRestriction = async (req, res, next) => {
	try {
		const token = req.cookies[TOKEN_KEY];
		const id = req.params.id;
		const creatorId = await service.getCreator(id);
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
	notCreatorRestriction
};
