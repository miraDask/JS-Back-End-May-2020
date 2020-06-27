const Example = require('../models/exampleModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

module.exports = {
	get: {
		create: (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				res.render('create', { isLoggedIn });
			} catch (error) {
				next();
			}
		},

		edit: (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				res.render('edit', { isLoggedIn });
			} catch (error) {
				next();
			}
		},

		delete: async (req, res, next) => {
			const { id } = req.params;
			try {
				await Example.findByIdAndRemove(id);
				res.redirect('/');
			} catch (error) {
				next();
			}
		},

		details: async (req, res, next) => {
			const { isLoggedIn } = req;
			const username = req.user ? req.user.username : '';
			const { id } = req.params;

			try {
				const model = await Example.findById(id).populate('creator').lean();
				const isCreator = model.creator.username === username;
				res.render('details', { ...model, isLoggedIn, username, isCreator });
			} catch (error) {
				next();
			}
		}
	},

	post: {
		create: async (req, res) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				const { isLoggedIn } = req;
				const username = req.user ? req.user.username : '';
				const errorMessages = errors.array().map((x) => x.msg);
				res.render('create', { isLoggedIn, username, errorMessages, ...req.body });
			} else {
				const creatorId = req.user ? req.user._id : '';

				const model = new Example({ ...req.body, creator: creatorId });
				const { _id } = await model.save();
				await User.findByIdAndUpdate(creatorId, {
					$addToSet: {
						models: [ _id ] // todo rename 'models' to real collection name...
					}
				});
				res.redirect('/');
				// Todo consider redirect to details :
				//res.redirect(`/example/details/${_id}`);
			}
		},

		edit: async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				const { isLoggedIn } = req;
				const username = req.user ? req.user.username : '';
				const errorMessages = errors.array().map((x) => x.msg);
				res.render('edit', { isLoggedIn, username, errorMessages, ...req.body });
			} else {
				const { id } = req.params;
				await Example.findByIdAndUpdate(id, req.body);
				res.redirect('/');
				// Todo consider redirect to details :
				//res.redirect(`/example/details/${id}`);
			}
		}
	}
};
