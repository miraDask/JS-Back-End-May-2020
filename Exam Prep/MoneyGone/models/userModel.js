const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const LETTERS_AND_DIGITS_PATTERN = /^[A-Za-z0-9]+$/;
const INCORRECT_USERNAME_FORMAT_MESSAGE = 'Username should contains only english letters and digits.';
const USERNAME_MIN_LENGTH = 4;
const INCORRECT_USERNAME_LENGTH_MESSAGE = `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`;
const REQUIRED_PASSWORD = 'Password is required.';
const REQUIRED_USERNAME = 'Username is required.';

const UserSchema = new Schema({
	username: {
		type: String,
		required: [ true, REQUIRED_USERNAME ],
		unique: true,
		minlength: [ USERNAME_MIN_LENGTH, INCORRECT_USERNAME_LENGTH_MESSAGE ],
		match: [ LETTERS_AND_DIGITS_PATTERN, INCORRECT_USERNAME_FORMAT_MESSAGE ]
	},
	password: {
		type: String,
		required: [ true, REQUIRED_PASSWORD ]
	},
	amount: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	expenses: [
		{
			type: ObjectId,
			ref: 'Expense'
		}
	]
});

module.exports = mongoose.model('User', UserSchema);
