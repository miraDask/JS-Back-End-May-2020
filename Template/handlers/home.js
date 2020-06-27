const Example = require('../models/exampleModel');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn } = req;
			try {
				let query = Example.find();
				if (search) {
					query = Example.find({ name: { $regex: search, $options: 'i' } });
				}
				const models = await query.lean();
				const username = req.user ? req.user.username : '';
				res.render('home', { search, isLoggedIn, username, models });
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
