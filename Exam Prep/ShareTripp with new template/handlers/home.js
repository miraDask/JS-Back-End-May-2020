module.exports = {
	get: {
		home: async (req, res, next) => {
			const { isLoggedIn } = req;
			try {
				const email = req.user ? req.user.email : '';
				res.render('home', { isLoggedIn, email });
			} catch (error) {
				next();
			}
		}
	}
};
