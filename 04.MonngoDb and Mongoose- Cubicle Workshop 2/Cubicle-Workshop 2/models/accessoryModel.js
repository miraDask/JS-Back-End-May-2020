const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
			type: Schema.Types.ObjectId,
			ref: 'Cube'
		}
	]
});

AccessorySchema.path('imageUrl').validate(function(url) {
	return url.startsWith('http://') || url.startsWith('https://');
}, 'Url is not valid');

module.exports = mongoose.model('Accessory', AccessorySchema);
