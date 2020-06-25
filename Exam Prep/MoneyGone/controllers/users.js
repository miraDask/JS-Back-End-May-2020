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
		},

		account: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';
			const id = req.user ? req.user._id : '';
			try {
				const accountInfo = await usersService.getAccountInfo(id);
				res.render('user/account', { ...accountInfo, isLoggedIn, username });
			} catch (error) {
				next();
			}
		}
	},

	post: {
		login: async (req, res, next) => {
			const { username, password } = req.body;
			const loginResult = await usersService.findUser(username, password);

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
			const { username, amount, password, repeatPassword } = req.body;
			const creationResult = await usersService.createUser({
				username,
				password,
				amount: Number(amount),
				repeatPassword
			});

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
		},
		refill: async (req, res, next) => {
			const { amount } = req.body;
			const { _id } = req.user;

			const refillResult = await usersService.updateAmount(_id, Number(amount));

			if (!refillResult.success) {
				const { errorMessages } = refillResult;
				res.redirect('/?message=' + errorMessages[0]);
			} else {
				res.redirect(`/?message=Successfully refilled account with ${Number(amount)}`);
			}
		}
	}
};
