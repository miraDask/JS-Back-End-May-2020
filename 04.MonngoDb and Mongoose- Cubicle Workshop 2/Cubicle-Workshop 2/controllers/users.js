const { generateToken } = require('./auth');
const { TOKEN_KEY } = require('./constants');

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
			res.clearCookie('aid');
			res.redirect('/');
		}
	},

	post: {
		login: async (req, res, next) => {
			const { username, password } = req.body;
			const userId = await usersService.findUser(username, password);

			if (!userId) {
				res.redirect('/login');
			}

			const token = generateToken(username, userId);
			res.cookie(TOKEN_KEY, token);
			res.redirect('/');
		},

		register: async (req, res, next) => {
			const { username, password, repeatPassword } = req.body;

			if (password !== repeatPassword) {
				res.redirect('/register');
			}

			const userId = await usersService.createUser(username, password);
			const token = generateToken(username, userId);
			res.cookie('aid', token);
			res.redirect('/');
		}
	}
};
