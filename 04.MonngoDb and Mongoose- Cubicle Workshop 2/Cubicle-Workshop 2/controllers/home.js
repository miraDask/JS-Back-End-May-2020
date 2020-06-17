const cubesService = require('../services/cubes');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search, from, to } = req.query;
			const { isLoggedIn } = req;
			try {
				const cubes = await cubesService.getAllCubes(search, from, to);
				res.render('index', { cubes, search, from, to, isLoggedIn });
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		about: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('about', { isLoggedIn });
		}
	}
};
