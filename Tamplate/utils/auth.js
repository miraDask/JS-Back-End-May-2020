const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const service = require('../services/example');
const User = require('../models/userModel');
const { TOKEN_KEY } = require('../handlers/constants');

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
		const { email, _id, username } = await User.findById(id).lean();
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
		const id = req.params.id; // item id
		const { userID } = jwt.decode(token, config.secret);

		const user = await User.findById(id).populate('models').lean();
		req.isCreator = JSON.stringify(user.collection).where((x) => x.creatorId === userID).length > 0;
	} catch (error) {
		req.isCreator = false;
	}

	next();
};

const notCreatorRestriction = async (req, res, next) => {
	try {
		const token = req.cookies[TOKEN_KEY];
		const id = req.params.id;
		const { userID } = jwt.decode(token, config.secret);
		const user = await User.findById(id).populate('models').lean();
		const isCreator = JSON.stringify(user.collection).where((x) => x.creatorId === userID).length > 0;

		if (isCreator) {
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
