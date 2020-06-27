const Tripp = require('../models/trippModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

module.exports = {
	get: {
		create: (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				const email = req.user ? req.user.email : '';
				res.render('create', { isLoggedIn, email });
			} catch (error) {
				next();
			}
		},

		join: async (req, res, next) => {
			const trippId = req.params.id;
			const userId = req.user._id;

			try {
				await Tripp.findByIdAndUpdate(trippId, {
					$addToSet: {
						buddies: [ userId ]
					},
					$inc: {
						seats: -1
					}
				});

				res.redirect(`/tripp/details/${trippId}`);
			} catch (error) {
				next();
			}
		},

		delete: async (req, res, next) => {
			const { id } = req.params;
			try {
				await Tripp.findByIdAndRemove(id);
				res.redirect('/tripp/all');
			} catch (error) {
				next();
			}
		},

		details: async (req, res, next) => {
			const { isLoggedIn } = req;
			const { email } = req.user;
			const { id } = req.params;

			try {
				const model = await Tripp.findById(id).populate('buddies creator').lean();
				const joined = model.buddies.some((x) => x.email === email);
				const noSeats = model.seats < 1;
				const isCreator = model.creator.email === email;
				res.render('details', { ...model, isLoggedIn, email, joined, noSeats, isCreator });
			} catch (error) {
				next();
			}
		},

		all: async (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				const email = req.user ? req.user.email : '';
				const tripps = await Tripp.find().lean();
				res.render('all', { isLoggedIn, email, tripps });
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
				const creator = req.user ? req.user._id : '';
				const { destination, dateTime, carImage, seats, description } = req.body;

				const [ startPoint, endPoint ] = destination.split(' - ');
				const [ date, time ] = dateTime.split(' - ');

				const model = new Tripp({ startPoint, endPoint, carImage, date, time, seats, description, creator });
				const { _id } = await model.save();
				await User.findByIdAndUpdate(creator, {
					$addToSet: {
						trippsHistory: [ _id ]
					}
				});
				res.redirect('/tripp/all');
			}
		}
	}
};
