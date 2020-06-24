const { generateToken } = require('../utils/auth');
const { TOKEN_KEY } = require('./constants');

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
			res.redirect('/');
		}
	},

	post: {
		login: async (req, res, next) => {
			const { username, email, password } = req.body;
			const loginResult = await usersService.findUser(username, email, password);

			if (!loginResult.success) {
				const { isLoggedIn } = req;
				const { errorMessages } = loginResult;
				res.render('user/login', { isLoggedIn, errorMessages, username });
			} else {
				const { userId } = loginResult;
				const token = generateToken(username, userId);
				res.cookie(TOKEN_KEY, token);
				res.redirect('/');
			}
		},

		register: async (req, res, next) => {
			const { username, email, password, repeatPassword } = req.body;
			const creationResult = await usersService.createUser(username, email, password, repeatPassword);

			if (!creationResult.success) {
				const { errorMessages } = creationResult;
				const { isLoggedIn } = req;
				res.render('user/register', { isLoggedIn, errorMessages, username });
			} else {
				const { userId } = creationResult;
				const token = generateToken(username, userId);
				res.cookie(TOKEN_KEY, token);
				res.redirect('/');
			}
		}
	}
};
