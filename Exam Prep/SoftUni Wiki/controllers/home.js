const { USERNAME } = require('./constants');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			try {
				res.render('index', { search, isLoggedIn, username });
			} catch (error) {
				next();
			}
		}
	}
};
