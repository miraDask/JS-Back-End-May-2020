const { generateToken } = require('../utils/auth');
const { TOKEN_KEY, EMAIL } = require('./constants');

const usersService = require('../services/users');

module.exports = {
	get: {
		login: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('user/login', { isLoggedIn });
		},

		register: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('user/register', { isLoggedIn });
		},

		logout: (req, res, next) => {
			res.clearCookie(TOKEN_KEY);
			res.clearCookie(EMAIL);
			res.redirect('/');
		}
	},

	post: {
		login: async (req, res, next) => {
			const { email, password } = req.body;
			const loginResult = await usersService.findUser(email, password);

			if (!loginResult.success) {
				const { isLoggedIn } = req;
				const { errorMessages } = loginResult;
				res.render('user/login', { isLoggedIn, errorMessages, email });
			} else {
				const { userId } = loginResult;
				const token = generateToken(email, userId);
				res.cookie(TOKEN_KEY, token);
				res.cookie(EMAIL, email);
				res.redirect('/');
			}
		},

		register: async (req, res, next) => {
			const { email, password, rePassword } = req.body;
			const creationResult = await usersService.createUser(email, password, rePassword);

			if (!creationResult.success) {
				const { errorMessages } = creationResult;
				const { isLoggedIn } = req;
				res.render('user/register', { isLoggedIn, errorMessages, email });
			} else {
				const { userId } = creationResult;
				const token = generateToken(email, userId);
				res.cookie(TOKEN_KEY, token);
				res.cookie(EMAIL, email);
				res.redirect('/');
			}
		}
	}
};
