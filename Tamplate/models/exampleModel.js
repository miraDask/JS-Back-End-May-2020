const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const exampleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true
	},
	difficulty: {
		type: Number,
		required: true,
		max: 6
	},
	creatorId: {
		type: ObjectId,
		ref: 'User'
	},
	users: [
		{
			type: ObjectId,
			ref: 'User'
		}
	]
});

module.exports = mongoose.model('Example', exampleSchema);
