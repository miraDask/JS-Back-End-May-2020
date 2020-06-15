const getLogin = (req, res) => {
	res.render('loginPage');
};

const getRegister = (req, res) => {
	res.render('registerPage');
};

module.exports = {
	getLogin,
	getRegister
};
