const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CubeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
		maxlength: 500
	},
	imageUrl: {
		type: String,
		required: true
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
