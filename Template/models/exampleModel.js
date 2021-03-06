const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

//todo rename with real model name
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
	creator: {
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

//todo rename with real model name
module.exports = mongoose.model('Example', exampleSchema);
