const { EMAIL } = require('./constants');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn } = req;
			const loggedEmail = req.cookies[EMAIL];
			try {
				res.render('home', { search, isLoggedIn, loggedEmail });
			} catch (error) {
				next();
			}
		}
	}
};
