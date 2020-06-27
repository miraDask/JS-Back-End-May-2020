const { TOKEN_KEY } = require('./constants');
const { validationResult } = require('express-validator');
const { generateToken } = require('../utils/auth');
const { hashPassword } = require('../utils/hashing');
const User = require('../models/userModel');

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
		login: async (req, res) => {
			const { email } = req.body;
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((x) => x.msg);
				const { isLoggedIn } = req;
				res.render('user/login', { isLoggedIn, errorMessages, email });
			} else {
				const { _id } = await User.findOne({ email });
				const token = generateToken(email, _id);
				res.cookie(TOKEN_KEY, token);
				res.redirect('/');
			}
		},

		register: async (req, res) => {
			const { email, password } = req.body;

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((x) => x.msg);
				const { isLoggedIn } = req;
				res.render('user/register', { isLoggedIn, errorMessages, email });
			} else {
				const hashedPassword = await hashPassword(password);
				const user = new User({ email, password: hashedPassword });
				const { _id } = await user.save();
				const token = generateToken(email, _id);
				res.cookie(TOKEN_KEY, token);
				res.redirect('/');
			}
		}
	}
};
