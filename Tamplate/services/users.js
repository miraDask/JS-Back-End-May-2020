const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const SALT_ROUNDS = 10;
const INVALID_LOGIN_MESSAGE = 'Invalid username or password.';

const PASSWORD_MIN_LENGTH = 8;
const INCORRECT_PASSWORD_LENGTH_MESSAGE = `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`;
const UNMATCHING_PASSWORDS_MESSAGE = 'Passwords should match.';
const LETTERS_AND_DIGITS_PATTERN = /^[A-Za-z0-9]+$/;
const INCORRECT_PASSWORD_FORMAT_MESSAGE = 'Password should contains only english letters and digits.';

const USERNAME_EXISTS_MESSAGE = 'User with that username already exists.';

module.exports = {
	getById: async (id) => await User.findById(id).lean(),
	findUser: async (username, email, password) => {
		const user = await User.findOne({ username, email });
		const errorMessages = [ INVALID_LOGIN_MESSAGE ];

		if (!user) {
			return {
				success: false,
				errorMessages
			};
		}

		const passwordIsCorrect = await bcrypt.compare(password, user.password);

		if (!passwordIsCorrect) {
			return {
				success: false,
				errorMessages
			};
		}

		return {
			success: true,
			userId: user._id
		};
	},

	createUser: async (username, email, password, repeatPassword) => {
		const errorMessages = [];
		if (password.length < PASSWORD_MIN_LENGTH) {
			errorMessages.push(INCORRECT_PASSWORD_LENGTH_MESSAGE);
		}

		if (password !== repeatPassword) {
			errorMessages.push(UNMATCHING_PASSWORDS_MESSAGE);
		}

		if (!password.match(LETTERS_AND_DIGITS_PATTERN)) {
			errorMessages.push(INCORRECT_PASSWORD_FORMAT_MESSAGE);
		}

		const hashedPassword = errorMessages.length > 0 ? null : await hashPassword(password);

		const user = new User({ username, email, password: hashedPassword });
		try {
			const { _id } = await user.save();

			return {
				success: true,
				userId: _id
			};
		} catch (error) {
			if (error.name === 'MongoError') {
				errorMessages.push(USERNAME_EXISTS_MESSAGE);
			} else {
				Object.keys(error.errors).forEach((x) => {
					errorMessages.push(error.errors[x].message);
				});
			}

			return {
				success: false,
				errorMessages
			};
		}
	}
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};
