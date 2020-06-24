const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

// Name
const NAME_MIN_LENGTH = 5;
const INCORRECT_NAME_LENGTH_MESSAGE = `Name should be at least ${NAME_MIN_LENGTH} characters long`;
const INCORRECT_NAME_FORMAT_MESSAGE = 'Name should contains only english letters, digits or white spaces.';
const REQUIRED_NAME = 'Name is required.';

//DESCRIPTION
const DESCRIPTION_MIN_LENGTH = 20;
const INCORRECT_DESCRIPTION_LENGTH_MESSAGE = `Description should be at least ${DESCRIPTION_MIN_LENGTH} characters long`;
const INCORRECT_DESCRIPTION_FORMAT_MESSAGE =
	'Description should contains only english letters, digits or white spaces.';
const REQUIRED_DESCRIPTION = 'Description is required.';

//IMAGE
const REQUIRED_IMAGE = 'Image link is required.';

const LETTERS_DIGITS_AND_WHITESPACE_PATTERN = /^[A-Za-z0-9\s]+$/;

const exampleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, REQUIRED_NAME ],
		minlength: [ NAME_MIN_LENGTH, INCORRECT_NAME_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_NAME_FORMAT_MESSAGE ]
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_DESCRIPTION_FORMAT_MESSAGE ]
	},
	imageUrl: {
		type: String,
		required: [ true, REQUIRED_IMAGE ]
	},
	difficulty: {
		type: Number,
		required: true,
		min: 1,
		max: 6
	},
	creatorId: {
		type: String,
		required: true
	},
	users: [
		{
			type: ObjectId,
			ref: 'User'
		}
	]
});

exampleSchema.path('imageUrl').validate(function(url) {
	return url.startsWith('http://') || url.startsWith('https://');
}, 'Url is not valid');

module.exports = mongoose.model('Example', exampleSchema);
