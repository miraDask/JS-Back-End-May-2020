const { EMAIL, TOKEN_KEY } = require('./constants');
const { getUserId } = require('../utils/auth');
const trippsService = require('../services/tripps');

module.exports = {
	get: {
		all: async (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				const loggedEmail = req.cookies[EMAIL];
				const tripps = await trippsService.getAll();
				res.render('tripp/all.hbs', { isLoggedIn, loggedEmail, tripps });
			} catch (error) {
				next();
			}
		},
		create: (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				const loggedEmail = req.cookies[EMAIL];
				res.render('tripp/create.hbs', { isLoggedIn, loggedEmail });
			} catch (error) {
				next();
			}
		},
		delete: async (req, res, next) => {
			try {
				const id = req.params.id;
				await trippsService.delete(id);
				res.redirect('/');
			} catch (error) {
				next();
			}
		},
		join: async (req, res, next) => {
			const token = req.cookies[TOKEN_KEY];
			const userId = getUserId(token);

			try {
				const id = req.params.id;
				await trippsService.join(id, userId);
				res.redirect(`/tripps/details/${id}`);
			} catch (error) {
				next();
			}
		},
		details: async (req, res, next) => {
			try {
				const { isLoggedIn } = req;
				const loggedEmail = req.cookies[EMAIL];
				const token = req.cookies[TOKEN_KEY];
				const creatorId = getUserId(token);

				const tripp = await trippsService.getTrippWithBuddiesById(req.params.id, creatorId);

				res.render('tripp/details', {
					isLoggedIn,
					loggedEmail,
					...tripp
				});
			} catch (error) {
				next();
			}
		}
	},

	post: {
		create: async (req, res, next) => {
			const { isLoggedIn } = req;
			const loggedEmail = req.cookies[EMAIL];
			const token = req.cookies[TOKEN_KEY];
			const { destination, dateTime, carImage, seats, description } = req.body;
			const creatorId = getUserId(token);

			const creationResult = await trippsService.create({
				destination,
				dateTime,
				carImage,
				seats,
				description,
				creatorId
			});

			if (!creationResult.success) {
				const { errorMessages } = creationResult;
				res.render('tripp/create.hbs', {
					isLoggedIn,
					loggedEmail,
					errorMessages,
					destination,
					dateTime,
					carImage,
					seats,
					description
				});
			} else {
				const { _id } = creationResult;
				res.redirect(`tripps/details/${_id}`);
			}
		}
	}
};
