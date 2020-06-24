const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, ObjectId } = Schema.Types;

const { INCORRECT_EMAIL_MESSAGE, REQUIRED_PASSWORD, REQUIRED_EMAIL, EMAIL_PATTERN } = require('../services/constants');

const UserSchema = new Schema({
	email: {
		type: String,
		required: [ true, REQUIRED_EMAIL ],
		unique: true,
		match: [ EMAIL_PATTERN, INCORRECT_EMAIL_MESSAGE ]
	},
	password: {
		type: String,
		required: [ true, REQUIRED_PASSWORD ]
	},
	trippsHistory: [
		{
			type: ObjectId,
			ref: 'Tripp'
		}
	]
});

module.exports = mongoose.model('User', UserSchema);
