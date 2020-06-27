const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

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
		required: true
	},
	carImage: {
		type: String,
		required: true
	},
	seats: {
		type: Number,
		required: true
	},
	creator: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	buddies: [
		{
			type: ObjectId,
			ref: 'User'
		}
	]
});

module.exports = mongoose.model('Tripp', trippSchema);
