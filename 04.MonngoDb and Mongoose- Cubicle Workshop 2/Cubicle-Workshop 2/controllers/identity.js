const env = process.env.NODE_ENV;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];

const User = require('../models/userModel');

const SALT_ROUNDS = 10;

const getLogin = (req, res) => {
	res.render('loginPage');
};

const getRegister = (req, res) => {
	res.render('registerPage');
};

const postRegister = async (req, res) => {
	const { username, password, repeatPassword } = req.body;

	if (password !== repeatPassword) {
		res.redirect('/register');
	}

	const userId = await createUser(username, password);
	const token = generateToken(username, userId);
	res.cookie('aid', token);

	res.redirect('/');
};

const createUser = async (username, password) => {
	const hashedPassword = await hashPassword(password);
	const user = new User({ username, password: hashedPassword });
	const { _id } = await user.save();
	return _id;
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const generateToken = (username, userId) => {
	const data = {
		username,
		userID: userId
	};

	const token = jwt.sign(data, config.secret);
	return token;
};

module.exports = {
	getLogin,
	getRegister,
	postRegister
};
