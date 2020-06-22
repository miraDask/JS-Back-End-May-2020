const articleService = require('../services/articlesService');

const { USERNAME, TOKEN_KEY } = require('./constants');
const { getUserId } = require('../utils/auth');

module.exports = {
	get: {
		create: (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			try {
				res.render('article-create', { isLoggedIn, username });
			} catch (error) {
				next();
			}
		},
		edit: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			const id = req.params.id;
			try {
				const article = await articleService.getArticleForEdit(id);
				res.render('article-edit', { isLoggedIn, username, ...article });
			} catch (error) {
				next();
			}
		},
		list: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			try {
				const { search } = req.query;
				const articles = await articleService.getAll(search);
				res.render('articles-list', { isLoggedIn, username, search, articles });
			} catch (error) {
				next();
			}
		},
		details: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.cookies[USERNAME];
			try {
				const id = req.params.id;

				const userId = req.cookies[TOKEN_KEY] ? getUserId(req.cookies[TOKEN_KEY]) : null;
				const article = await articleService.getArticleById(id);
				const isCreator = article.creatorId === userId;
				res.render('article-details', { isLoggedIn, username, ...article, isCreator });
			} catch (error) {
				next();
			}
		},
		delete: async (req, res, next) => {
			try {
				const id = req.params.id;
				await articleService.deleteArticle(id);
				res.redirect('/');
			} catch (error) {
				next();
			}
		}
	},

	post: {
		create: async (req, res) => {
			const { title, description } = req.body;
			const token = req.cookies[TOKEN_KEY];
			const creator = getUserId(token);

			const creationResult = await articleService.createArticle({ title, description, creator });

			if (!creationResult.success) {
				const { isLoggedIn } = req;
				const username = req.cookies[USERNAME];
				const { errorMessages } = creationResult;

				res.render('article-create', {
					isLoggedIn,
					username,
					errorMessages,
					title,
					description
				});
			} else {
				const { _id } = creationResult._id;

				res.redirect(`/articles/${_id}`);
			}
		},
		edit: async (req, res, next) => {
			const { description } = req.body;
			const _id = req.params.id;
			const updateResult = await articleService.editArticle(_id, description);

			if (!updateResult.success) {
				const { isLoggedIn } = req;
				const username = req.cookies[USERNAME];
				const { errorMessages } = updateResult;
				res.render('article-edit', { isLoggedIn, username, errorMessages, description, _id });
			} else {
				res.redirect(`/articles/${_id}`);
			}
		}
	}
};
