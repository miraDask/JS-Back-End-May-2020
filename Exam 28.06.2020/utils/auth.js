const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Play = require('../models/playModel');
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
		const { _id, username } = await User.findById(id).lean();
		req.user = {  _id: _id.toString(), username };
		req.isLoggedIn = true;
	} catch (error) {
		req.isLoggedIn = false;
	}

	next();
};

const alreadyLikedRestriction = async (req, res, next) => {
	const { _id } = req.user;
	const {id } = req.params;

	const user = await User.findById(_id).populate('likedPlays').lean();
	const isAlreadyLiked = user.likedPlays.some(x => x._id.toString() === id);
	const play = await Play.findById(id).populate('creator').lean();
	const isCreator = play.creator._id.toString() === _id;
	if (isAlreadyLiked || isCreator) {
		return res.redirect('/?message=unauthorized');
	} else {
		next();
	}
}

const anonymousRestriction = (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];

	if (!token) {
		return res.redirect('/?message=unauthorized');
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
		const model = await Play.findById(id).populate('creator').lean();
		const isCreator = model.creator._id.toString() === userID;

		if (isCreator) {
			next();
		} else {
			return res.redirect('/?message=unauthorized');
		}
	} catch (error) {
		return res.redirect('/?message=unauthorized');
	}
};

module.exports = {
	generateToken,
	authenticationCheck,
	anonymousRestriction,
	getUserId,
	notCreatorRestriction,
	alreadyLikedRestriction
};
