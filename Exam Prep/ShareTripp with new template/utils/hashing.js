const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const validatePassword = async (inputPassword, userPassword) => await bcrypt.compare(inputPassword, userPassword);

module.exports = {
	hashPassword,
	validatePassword
};
