const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Example = require('../models/exampleModel');
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

const notCreatorRestriction = async (req, res, next) => {
	try {
		const token = req.cookies[TOKEN_KEY];
		const id = req.params.id;
		const { userID } = jwt.decode(token, config.secret);
		const model = await Example.findById(id).populate('creator').lean();
		const isCreator = model.creator._id.toString() === userID;

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
