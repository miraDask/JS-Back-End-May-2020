const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	TITLE_MIN_LENGTH,
	DESCRIPTION_MIN_LENGTH,
	DESCRIPTION_MAX_LENGTH,
	LETTERS_DIGITS_AND_WHITESPACE_PATTERN,
	INCORRECT_DESCRIPTION_MESSAGE,
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE,
	INCORRECT_TITLE_MESSAGE,
	INCORRECT_TITLE_LENGTH_MESSAGE,
	REQUIRED_IMAGE,
	REQUIRED_NAME,
	REQUIRED_DESCRIPTION
} = require('../services/constants');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [ true, REQUIRED_NAME ],
		unique: true,
		minlength: [ TITLE_MIN_LENGTH, INCORRECT_TITLE_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_TITLE_MESSAGE ]
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		maxlength: [ DESCRIPTION_MAX_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_DESCRIPTION_MESSAGE ]
	},
	imageUrl: {
		type: String,
		required: [ true, REQUIRED_IMAGE ]
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		required: true
	},
	creatorId: {
		type: String,
		required: true
	},
	enrolledUsers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

CourseSchema.path('imageUrl').validate(function(url) {
	return url.startsWith('http://') || url.startsWith('https://');
}, 'Image url is should start with http or https');

module.exports = mongoose.model('Course', CourseSchema);
