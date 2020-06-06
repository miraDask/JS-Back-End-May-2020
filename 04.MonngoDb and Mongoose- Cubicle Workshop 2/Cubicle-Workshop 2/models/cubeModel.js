const mongoose = require('mongoose');

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
	accessories: [
		{
			type: 'ObjectId',
			ref: 'Accessory'
		}
	]
});

// CubeSchema.path('imageUrl').validate(function(value) {
// 	if (!this.imageUrl.startsWith('http://') || !this.imageUrl.startsWith('https://')) {
// 		return false;
// 	}
// 	return true;
// });

module.exports = mongoose.model('Cube', CubeSchema);
