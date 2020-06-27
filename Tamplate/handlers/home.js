module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn } = req;
			try {
				const username = req.user ? req.user.username : '';
				res.render('home', { search, isLoggedIn, username });
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
