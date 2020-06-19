const mongoose = require('mongoose');
const {
	LETTERS_AND_DIGITS_PATTERN,
	INCORRECT_USERNAME_MESSAGE,
	INCORRECT_USERNAME_LENGTH_MESSAGE,
	NAME_MIN_LENGTH,
	REQUIRED_PASSWORD,
	REQUIRED_USERNAME
} = require('../services/constants');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [ true, REQUIRED_USERNAME ],
		unique: true,
		minlength: [ NAME_MIN_LENGTH, INCORRECT_USERNAME_LENGTH_MESSAGE ],
		match: [ LETTERS_AND_DIGITS_PATTERN, INCORRECT_USERNAME_MESSAGE ]
	},
	password: {
		type: String,
		required: [ true, REQUIRED_PASSWORD ]
	}
});

module.exports = mongoose.model('User', UserSchema);
