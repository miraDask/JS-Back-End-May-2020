const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String } = Schema.Types;

const {
	LETTERS_AND_DIGITS_PATTERN,
	INCORRECT_USERNAME_MESSAGE,
	INCORRECT_USERNAME_LENGTH_MESSAGE,
	INCORRECT_EMAIL_MESSAGE,
	NAME_MIN_LENGTH,
	REQUIRED_PASSWORD,
	REQUIRED_USERNAME,
	REQUIRED_EMAIL,
	EMAIL_PATTERN
} = require('../services/constants');

const UserSchema = new Schema({
	username: {
		type: String,
		required: [ true, REQUIRED_USERNAME ],
		unique: true,
		minlength: [ NAME_MIN_LENGTH, INCORRECT_USERNAME_LENGTH_MESSAGE ],
		match: [ LETTERS_AND_DIGITS_PATTERN, INCORRECT_USERNAME_MESSAGE ]
	},
	email: {
		type: String,
		required: [ true, REQUIRED_EMAIL ],
		unique: true,
		match: [ EMAIL_PATTERN, INCORRECT_EMAIL_MESSAGE ]
	},
	password: {
		type: String,
		required: [ true, REQUIRED_PASSWORD ]
	}
});

module.exports = mongoose.model('User', UserSchema);
