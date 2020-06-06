const mongoose = require('mongoose');

const AccessorySchema = new mongoose.Schema({
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
	cubes: [
		{
			type: 'ObjectId',
			ref: 'Cube'
		}
	]
});

AccessorySchema.path('imageUrl').validate(function(value) {
	if (!this.startsWith('http//') || !this.startsWith('https//')) {
		return false;
	}
	return true;
});

module.exports = mongoose.model('Accessory', AccessorySchema);
