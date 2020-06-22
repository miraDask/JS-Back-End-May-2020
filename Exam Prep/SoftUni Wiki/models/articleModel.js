const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	NAME_MIN_LENGTH,
	DESCRIPTION_MIN_LENGTH,
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE,
	INCORRECT_NAME_LENGTH_MESSAGE,
	REQUIRED_NAME,
	REQUIRED_DESCRIPTION
} = require('../services/constants');

const ArticleSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required: [ true, REQUIRED_NAME ],
		minlength: [ NAME_MIN_LENGTH, INCORRECT_NAME_LENGTH_MESSAGE ]
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ]
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Article', ArticleSchema);
