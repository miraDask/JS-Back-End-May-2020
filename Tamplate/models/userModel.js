const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String } = Schema.Types;

const LETTERS_AND_DIGITS_PATTERN = /^[A-Za-z0-9]+$/;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const INCORRECT_USERNAME_FORMAT_MESSAGE = 'Username should contains only english letters and digits.';
const USERNAME_MIN_LENGTH = 5;
const INCORRECT_USERNAME_LENGTH_MESSAGE = `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`;
const INCORRECT_EMAIL_FORMAT_MESSAGE = 'Invalid email format.';
const REQUIRED_PASSWORD = 'Password is required.';
const REQUIRED_USERNAME = 'Username is required.';
const REQUIRED_EMAIL = 'Email is required.';

const UserSchema = new Schema({
	username: {
		type: String,
		required: [ true, REQUIRED_USERNAME ],
		unique: true,
		minlength: [ USERNAME_MIN_LENGTH, INCORRECT_USERNAME_LENGTH_MESSAGE ],
		match: [ LETTERS_AND_DIGITS_PATTERN, INCORRECT_USERNAME_FORMAT_MESSAGE ]
	},
	email: {
		type: String,
		required: [ true, REQUIRED_EMAIL ],
		unique: true,
		match: [ EMAIL_PATTERN, INCORRECT_EMAIL_FORMAT_MESSAGE ]
	},
	password: {
		type: String,
		required: [ true, REQUIRED_PASSWORD ]
	}
});

module.exports = mongoose.model('User', UserSchema);
