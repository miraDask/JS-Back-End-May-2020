const Article = require('../models/articleModel');
const {
	ARTICLE_EXISTS_MESSAGE,
	DESCRIPTION_MIN_LENGTH,
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE
} = require('../services/constants');

const createArticle = async (articleObject) => {
	const article = new Article(articleObject);
	try {
		const { _id } = await article.save();
		return {
			success: true,
			_id
		};
	} catch (error) {
		const errorMessages = [];
		if (error.name === 'MongoError') {
			errorMessages.push(ARTICLE_EXISTS_MESSAGE);
		} else {
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});
		}

		return {
			success: false,
			errorMessages
		};
	}
};

const getArticleById = async (id) => {
	const { title, description, creator, _id } = await Article.findById(id).populate('creator').lean();

	const paragraphs = description.split(/[\r\n]{2,}/);

	return {
		_id,
		title,
		paragraphs,
		creatorId: creator._id.toString()
	};
};

const getArticleForEdit = async (id) => await Article.findById(id).lean();

const getLatestArticles = async () => {
	const articles = await Article.find().sort({ createdOn: -1 }).limit(3).lean();

	const articlesModified = articles.map((x) => {
		let paragraphs = x.description.split(/[\r\n]{2,}/);
		const paragraphsCount = paragraphs[0].length >= 50 ? 1 : 2;
		paragraphs = paragraphs.slice(0, paragraphsCount);
		return {
			_id: x._id,
			title: x.title,
			description: (x.description = paragraphs.join('\r\n'))
		};
	});

	return articlesModified;
};

const getAll = async (search = null) => {
	let query = Article.find();

	if (search) {
		query = Article.find({ description: { $regex: search, $options: 'i' } });
	}

	return await query.select('title _id').lean();
};

const editArticle = async (id, description) => {
	if (description.length < DESCRIPTION_MIN_LENGTH) {
		return {
			success: false,
			errorMessages: [ INCORRECT_DESCRIPTION_LENGTH_MESSAGE ]
		};
	}

	try {
		await Article.findByIdAndUpdate(id, { description: description });
		return {
			success: true
		};
	} catch (error) {
		if (error.name === 'MongoError') {
			errorMessages.push(ARTICLE_EXISTS_MESSAGE);
		} else {
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});
		}

		return {
			success: false,
			errorMessages
		};
	}
};

const deleteArticle = async (id) => await Article.findByIdAndRemove(id);

module.exports = {
	createArticle,
	getArticleById,
	getLatestArticles,
	getAll,
	editArticle,
	deleteArticle,
	getArticleForEdit
};
