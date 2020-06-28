const { body } = require('express-validator');
const User = require('../models/userModel');
const Play = require('../models/playModel');

const { validatePassword } = require('../utils/hashing');

module.exports = {
	validateUserRegisterInput: [
		body('username')
			.isAlphanumeric()
			.withMessage('Username should contains only english letters and digits.')
			.isLength({min: 3})
			.withMessage('Username should be at least 3 characters long')
			.notEmpty()
			.withMessage('Username is required')
			.custom(async (username) => {
				const user = await User.findOne({ username });
				if (user) {
					return Promise.reject('Username already in use');
				}

				return true;
			}),

		body('password')
			.isAlphanumeric()
			.withMessage('Password should contains only english letters and digits.')
			.notEmpty()
			.withMessage('Password is required')
			.isLength({ min: 3 })
			.withMessage('Password should be at least 3 characters long')
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
				const user = await User.findOne({ username: req.body.username});
				if (!user) {
					return Promise.reject('Invalid user or password.');
				}
				const passwordIsCorrect = await validatePassword(value, user.password);
				if (!passwordIsCorrect) {
					return Promise.reject('Invalid user or password.');
				}

				return true;
			}),
		body('username').notEmpty().withMessage('Username is required')
	],

	validateCreate: [
		body('imageUrl')
			.notEmpty()
			.withMessage('Image is required')
			.custom((value) => {
				const urlIsValid = value.startsWith('http://') || value.startsWith('https://');
				if (!urlIsValid) {
					return Promise.reject('Image url is invalid');
				}

				return true;
			}),
		body('title')
			.notEmpty()
			.withMessage('Title is required')
			.custom(async value => {
				const play = await Play.findOne({ title: value});
				if (play) {
					return Promise.reject(`Play with title ${value} already exists.`);
				}

				return true;
			}),
		body('description')
			.notEmpty()
			.withMessage('Description is required')
			.isLength({ min: 1, max: 50 })
			.withMessage('Description must be between 1 and 50 characters long')
	],

	validateEdit: [
		body('imageUrl')
			.notEmpty()
			.withMessage('Image is required')
			.custom((value) => {
				const urlIsValid = value.startsWith('http://') || value.startsWith('https://');
				if (!urlIsValid) {
					return Promise.reject('Image url is invalid');
				}

				return true;
			}),
		body('title')
			.notEmpty()
			.withMessage('Title is required'),
		body('description')
			.notEmpty()
			.withMessage('Description is required')
			.isLength({ min: 1, max: 50 })
			.withMessage('Description must be between 1 and 50 characters long')
	]
};
