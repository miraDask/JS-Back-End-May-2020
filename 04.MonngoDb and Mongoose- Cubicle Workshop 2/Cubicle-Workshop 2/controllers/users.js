const bcrypt = require('bcrypt');
const { generateToken } = require('./auth');

const User = require('../models/userModel');

const { TOKEN_KEY } = require('./constants');
const SALT_ROUNDS = 10;

const getLogin = (req, res) => {
	const { isLoggedIn } = req;
	res.render('loginPage', { isLoggedIn });
};

const postLogin = async (req, res) => {
	const { username, password } = req.body;
	const userId = await findUser(username, password);

	if (!userId) {
		res.redirect('/login');
	}

	const token = generateToken(username, userId);
	res.cookie(TOKEN_KEY, token);

	res.redirect('/');
};

const getRegister = (req, res) => {
	const { isLoggedIn } = req;
	res.render('registerPage', { isLoggedIn });
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

const getLogout = (req, res) => {
	res.clearCookie('aid');

	res.redirect('/');
};

const findUser = async (username, password) => {
	const user = await User.findOne({ username });

	if (!user) {
		return null;
	}

	const passwordIsCorrect = await bcrypt.compare(password, user.password);

	if (!passwordIsCorrect) {
		return null;
	}

	return user._id;
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

module.exports = {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	getLogout
};
