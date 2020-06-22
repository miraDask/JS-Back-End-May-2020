const { USERNAME } = require('./constants');
const articleService = require('../services/articlesService');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			const articles = await articleService.getLatestArticles();
			try {
				res.render('index', { isLoggedIn, username, articles });
			} catch (error) {
				next();
			}
		}
	}
};
