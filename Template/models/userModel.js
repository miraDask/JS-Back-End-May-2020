const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, ObjectId } = Schema.Types;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},

	models: [
		{
			type: ObjectId,
			ref: 'Example'
		}
	]
});

module.exports = mongoose.model('User', UserSchema);
