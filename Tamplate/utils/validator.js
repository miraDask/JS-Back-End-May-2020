const { body } = require('express-validator');
const User = require('../models/userModel');
const { validatePassword } = require('../utils/hashing');

module.exports = {
	validateUserRegisterInput: [
		body('email')
			.isEmail()
			.withMessage('Email is not in correct format')
			.notEmpty()
			.withMessage('Email field is required')
			.custom(async (email) => {
				const user = await User.findOne({ email });
				if (user) {
					return Promise.reject();
				}
			})
			.withMessage('Email already in use'),

		body('username')
			.isAlphanumeric()
			.withMessage('Username should contains only english letters and digits.')
			.notEmpty()
			.withMessage('Email field is required')
			.custom(async (username) => {
				const user = await User.findOne({ username });
				if (user) {
					return Promise.reject();
				}
			})
			.withMessage('Username already in use'),

		body('password')
			.isAlphanumeric()
			.withMessage('Password should contains only english letters and digits.')
			.notEmpty()
			.withMessage('Password is required')
			.isLength({ min: 5 })
			.withMessage('Password should be at least 5 characters long')
			.custom((value, { req }) => {
				return value === req.body.repeatPassword;
			})
			.withMessage('Passwords should match.')
	],

	validateUserLoginInput: [
		body('password')
			.notEmpty()
			.withMessage('Password is required')
			.custom(async (value, { req }) => {
				const user = await User.findOne({ username: req.body.username, email: req.body.email });
				if (!user) {
					return Promise.reject();
				}
				const passwordIsCorrect = await validatePassword(value, user.password);
				if (!passwordIsCorrect) {
					return Promise.reject();
				}
			})
			.withMessage('Invalid user or password.'),
		body('username').notEmpty().withMessage('Username is required'),
		body('email').notEmpty().withMessage('Email is required')
	],

	validateModel: [
		body('imageUrl')
			.notEmpty()
			.withMessage('Image is required')
			.custom((value) => {
				if (!value.startsWith('http://') || !value.startsWith('https://')) {
					return Promise.reject();
				}
			})
			.withMessage('image url is invalid'),
		body('name')
			.notEmpty()
			.withMessage('Name is required')
			.isLength({ min: 3, max: 20 })
			.withMessage('Name must be between 3 and 20 characters long'),
		body('description')
			.notEmpty()
			.withMessage('Description is required')
			.isLength({ min: 20, max: 200 })
			.withMessage('Description must be between 20 and 200 characters long'),
		body('difficulty')
			.notEmpty()
			.withMessage('Difficulty is required')
			.isInt({ min: 1, max: 6 })
			.withMessage('Invalid format')
	]
};
