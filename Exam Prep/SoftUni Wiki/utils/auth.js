const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const articleService = require('../services/articlesService');

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

const creatorCheck = (req, res, next) => {
	const token = req.cookies[TOKEN_KEY];
	const articleId = req.params.id;
	const userId = getUserId(token);
	const { creatorId } = articleService.getArticleById(articleId);

	if (creatorId === userId) {
		next();
	} else {
		res.send('Not permitted');
	}
};
module.exports = {
	generateToken,
	authenticationCheck,
	anonymousRestriction,
	getUserId,
	creatorCheck
};
