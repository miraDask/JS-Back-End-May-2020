const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	NAME_MIN_LENGTH,
	DESCRIPTION_MIN_LENGTH,
	LETTERS_DIGITS_AND_WHITESPACE_PATTERN,
	INCORRECT_DESCRIPTION_MESSAGE,
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE,
	INCORRECT_NAME_MESSAGE,
	INCORRECT_NAME_LENGTH_MESSAGE,
	REQUIRED_IMAGE,
	REQUIRED_NAME,
	REQUIRED_DESCRIPTION
} = require('../services/constants');

const CubeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, REQUIRED_NAME ],
		minlength: [ NAME_MIN_LENGTH, INCORRECT_NAME_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_NAME_MESSAGE ]
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ],
		match: [ LETTERS_DIGITS_AND_WHITESPACE_PATTERN, INCORRECT_DESCRIPTION_MESSAGE ]
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
	accessories: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Accessory'
		}
	]
});

CubeSchema.path('imageUrl').validate(function(url) {
	return url.startsWith('http://') || url.startsWith('https://');
}, 'Url is not valid');

module.exports = mongoose.model('Cube', CubeSchema);
