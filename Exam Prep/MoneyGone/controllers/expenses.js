const expensesService = require('../services/expenses');

module.exports = {
	get: {
		create: (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';

			try {
				res.render('expenses/create', { isLoggedIn, username });
			} catch (error) {
				next();
			}
		},
		report: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';
			const { id } = req.params;

			try {
				const expense = await expensesService.getById(id);
				res.render('expenses/report', { ...expense, isLoggedIn, username });
			} catch (error) {
				next();
			}
		},
		delete: async (req, res, next) => {
			const { id } = req.params;
			try {
				await expensesService.delete(id);
				res.redirect('/');
			} catch (error) {
				next();
			}
		}
	},

	post: {
		create: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';
			const creatorId = req.user ? req.user._id : '';
			const { merchant, description, category, total, report } = req.body;
			const creationResult = await expensesService.create({
				merchant,
				description,
				category,
				total,
				report: !!report,
				creatorId,
				createdOn: Date.now()
			});

			if (!creationResult.success) {
				const { errorMessages } = creationResult;
				res.render('expenses/create', { isLoggedIn, username, errorMessages });
			} else {
				res.redirect('/');
			}
		}
	}
};
