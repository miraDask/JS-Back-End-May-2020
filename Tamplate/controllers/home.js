module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn } = req;
			try {
				res.render('home', { search, isLoggedIn });
			} catch (error) {
				next();
			}
		},
		about: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('about', { isLoggedIn });
		}
	}
};
