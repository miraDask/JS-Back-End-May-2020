const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Tripp = require('../models/trippModel');
const { TOKEN_KEY } = require('../handlers/constants');

const generateToken = (email, userId) => {
	const data = {
		email,
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
		const { email, _id } = await User.findById(id).lean();
		req.user = { email, _id: _id.toString() };
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

const notCreatorRestriction = async (req, res, next) => {
	try {
		const token = req.cookies[TOKEN_KEY];
		const id = req.params.id;
		const { userID } = jwt.decode(token, config.secret);
		const tripp = await Tripp.findById(id).populate('creator').lean();
		const isCreator = tripp.creator._id.toString() === userID;

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
	notCreatorRestriction
};
