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
		body('password')
			.isAlphanumeric()
			.withMessage('Password should contains only english letters and digits.')
			.notEmpty()
			.withMessage('Password is required')
			.isLength({ min: 6 })
			.withMessage('Password should be at least 6 characters long')
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
		body('email').notEmpty().withMessage('Email is required')
	],

	validateModel: [
		body('carImage').notEmpty().withMessage('Image is required').custom((value) => {
			const isValidUrl = value.startsWith('http://') || value.startsWith('https://');
			if (!isValidUrl) {
				return Promise.reject('Image url is invalid');
			}

			return true;
		}),
		body('destination').notEmpty().withMessage('Destination is required').custom((value) => {
			if (!value.includes(' - ')) {
				return Promise.reject('Invalid format. Start point and final point should be separated with " - "');
			}

			const [ startPoint, endpoint ] = value.split(' - ');
			if (startPoint.length < 4 || endpoint.length < 4) {
				return Promise.reject('Start point and final point should be at least 4 characters long');
			}

			return true;
		}),
		body('dateTime').notEmpty().withMessage('Date and time are required').custom((value) => {
			if (!value.includes(' - ')) {
				return Promise.reject('Invalid format. Date and time should be separated with " - "');
			}

			const [ date, time ] = value.split(' - ');
			if (date.length < 6 || time.length < 6) {
				return Promise.reject('Date and time should be at least 6 characters long');
			}

			return true;
		}),
		body('description')
			.notEmpty()
			.withMessage('Description is required')
			.isLength({ min: 10 })
			.withMessage('Description must be at least 10 characters long'),
		body('seats')
			.notEmpty()
			.withMessage('Seats are required')
			.isInt({ min: 1 })
			.withMessage('Seats should be positive number')
	]
};
