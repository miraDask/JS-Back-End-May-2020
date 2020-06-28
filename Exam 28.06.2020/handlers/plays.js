const Play = require('../models/playModel');
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

		edit: async (req, res, next) => {
			try {
				const { id } = req.params;
				const { isLoggedIn } = req;
				const play = await Play.findById(id).lean();
				res.render('edit', { isLoggedIn , ...play});
			} catch (error) {
				next();
			}
		},

		delete: async (req, res, next) => {
			const { id } = req.params;
			try {
				await Play.findByIdAndRemove(id);
				res.redirect('/');
			} catch (error) {
				next();
			}
		},

		details: async (req, res, next) => {
			const { isLoggedIn } = req;
			const {username, _id} = req.user;

			const { id } = req.params;

			try {
				const play = await Play.findById(id).populate('creator usersLiked').lean();
				const isCreator = play.creator._id.toString() === _id;
				const alreadyLiked = play.usersLiked.some(x => x.username === username);
				res.render('details', { ...play, isLoggedIn, username, isCreator, alreadyLiked });
			} catch (error) {
				next();
			}
		}, 
		
		like: async (req,res,next) => {
			const { id } = req.params;
			const { _id } = req.user;
			try {
				await Play.findByIdAndUpdate(id, {
					$addToSet : {
						usersLiked: [ _id ]
					},
					$inc:{
						likes: +1
					}
				});
				await User.findByIdAndUpdate(_id, {
					$addToSet: {
						likedPlays: [ id ]
					}
				})
				res.redirect('/');
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
				const errorMessages = errors.array().map((x) => x.msg);
				res.render('create', { isLoggedIn, errorMessages, ...req.body });
			} else {
				const creatorId = req.user ? req.user._id : '';
				const { title, description, imageUrl, isPublic } = req.body;
				const play = new Play({
					title,
					description,
					imageUrl,
					isPublic: !!isPublic,
					creator: creatorId
				});
				const { _id } = await play.save();
				res.redirect('/');
			}
		},

		edit: async (req, res, next) => {
			const errors = validationResult(req);
			const { id } = req.params;
			const { title, description, imageUrl, isPublic } = req.body;

			if (!errors.isEmpty()) {
				const { isLoggedIn } = req;
				const errorMessages = errors.array().map((x) => x.msg);
				res.render('edit', { isLoggedIn, errorMessages, title, description, imageUrl, isPublic: !!isPublic, _id: id });
			} else {
				await Play.findByIdAndUpdate(id, { title, description, imageUrl, isPublic: !!isPublic });
				res.redirect('/');
			}
		}
	}
};
