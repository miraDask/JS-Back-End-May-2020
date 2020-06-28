const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Boolean, ObjectId, Number } = Schema.Types;

const playSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true,
		maxlength: 50,
	},
	imageUrl: {
		type: String,
		required: true
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type : Date, 
		default: Date.now
	},
    likes: {
		type:Number
	},
	creator: {
		type: ObjectId,
		ref: 'User'
	},
	usersLiked : [
		{
			type: ObjectId,
			ref: 'User'
		}
	]
});

module.exports = mongoose.model('Play', playSchema);
