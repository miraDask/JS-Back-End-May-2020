const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const {
	SALT_ROUNDS,
	UNMATCHING_PASSWORDS_MESSAGE,
	INCORRECT_PASSWORD_MESSAGE,
	INCORRECT_PASSWORD_LENGTH_MESSAGE,
	LETTERS_AND_DIGITS_PATTERN,
	USERNAME_EXISTS_MESSAGE,
	PASSWORD_MIN_LENGTH,
	INVALID_LOGIN_MESSAGE
} = require('./constants');

module.exports = {
	findUser: async (username, password) => {
		const user = await User.findOne({ username });
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

	createUser: async (username, password, repeatPassword) => {
		const errorMessages = [];
		if (password.length < PASSWORD_MIN_LENGTH) {
			errorMessages.push(INCORRECT_PASSWORD_LENGTH_MESSAGE);
		}

		if (password !== repeatPassword) {
			errorMessages.push(UNMATCHING_PASSWORDS_MESSAGE);
		}

		if (!password.match(LETTERS_AND_DIGITS_PATTERN)) {
			errorMessages.push(INCORRECT_PASSWORD_MESSAGE);
		}

		const hashedPassword = errorMessages.length > 0 ? null : await hashPassword(password);

		const user = new User({ username, password: hashedPassword });
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