const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const {
	DESCRIPTION_MIN_LENGTH,
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE,
	REQUIRED_IMAGE,
	REQUIRED_POINTS,
	REQUIRED_DESCRIPTION
} = require('../services/constants');

const trippSchema = new mongoose.Schema({
	startPoint: {
		type: String,
		required: true
	},
	endPoint: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ]
	},
	carImage: {
		type: String,
		required: [ true, REQUIRED_IMAGE ]
	},
	seats: {
		type: Number,
		required: true,
		min: 1
	},
	creatorId: {
		type: String,
		required: true
	},
	buddies: [
		{
			type: ObjectId,
			ref: 'User'
		}
	]
});

trippSchema.path('carImage').validate(function(url) {
	return url.startsWith('http://') || url.startsWith('https://');
}, 'Url is not valid');

module.exports = mongoose.model('Tripp', trippSchema);
