const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, ObjectId } = Schema.Types;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},

	trippsHistory: [
		{
			type: ObjectId,
			ref: 'Tripp'
		}
	]
});

module.exports = mongoose.model('User', UserSchema);
