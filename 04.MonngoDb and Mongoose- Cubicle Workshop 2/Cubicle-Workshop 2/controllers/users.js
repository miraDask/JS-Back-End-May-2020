const { generateToken } = require('./auth');
const { TOKEN_KEY, USERNAME } = require('./constants');

const usersService = require('../services/users');

module.exports = {
	get: {
		login: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('loginPage', { isLoggedIn });
		},

		register: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('registerPage', { isLoggedIn });
		},

		logout: (req, res, next) => {
			res.clearCookie(TOKEN_KEY);
			res.clearCookie(USERNAME);
			res.redirect('/');
		}
	},

	post: {
		login: async (req, res, next) => {
			const { username, password } = req.body;
			const loginResult = await usersService.findUser(username, password);

			if (!loginResult.success) {
				const { isLoggedIn } = req;
				const { errorMessages } = loginResult;
				res.render('loginPage', { isLoggedIn, errorMessages, username });
			} else {
				const { userId } = loginResult;
				const token = generateToken(username, userId);
				res.cookie(TOKEN_KEY, token);
				res.cookie(USERNAME, username);
				res.redirect('/');
			}
		},

		register: async (req, res, next) => {
			const { username, password, repeatPassword } = req.body;
			const creationResult = await usersService.createUser(username, password, repeatPassword);

			if (!creationResult.success) {
				const { errorMessages } = creationResult;
				const { isLoggedIn } = req;
				res.render('registerPage', { isLoggedIn, errorMessages, username });
			} else {
				const { userId } = creationResult;
				const token = generateToken(username, userId);
				res.cookie(TOKEN_KEY, token);
				res.cookie(USERNAME, username);
				res.redirect('/');
			}
		}
	}
};
