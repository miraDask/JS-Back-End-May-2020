const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const SALT_ROUNDS = 10;

module.exports = {
	findUser: async (username, password) => {
		const user = await User.findOne({ username });

		if (!user) {
			return null;
		}

		const passwordIsCorrect = await bcrypt.compare(password, user.password);

		if (!passwordIsCorrect) {
			return null;
		}

		return user._id;
	},

	createUser: async (username, password) => {
		const hashedPassword = await hashPassword(password);
		const user = new User({ username, password: hashedPassword });
		const { _id } = await user.save();
		return _id;
	}
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};
