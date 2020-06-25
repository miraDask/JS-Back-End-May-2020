const expensesService = require('../services/expenses');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';
			const creatorId = req.user ? req.user._id : '';
			const { message } = req.query;
			try {
				const expenses = await expensesService.getAll(creatorId);
				res.render('home', {
					isLoggedIn,
					username,
					expenses,
					message
				});
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
