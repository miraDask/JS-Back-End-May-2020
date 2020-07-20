const Play = require('../models/playModel');

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { likes, date, message } = req.query;
			const { isLoggedIn } = req;
			try {
				let query = Play.find({ isPublic: true });
				if (isLoggedIn) {
					if (likes) {
						query = query.sort({ likes: -1 });
					} else {
						query = query.sort({ createdAt: -1 })
					}
				} else {
					query = query.sort({ likes: -1 }).limit(3)
				}

				const plays = await query.lean();
				res.render('home', { isLoggedIn, plays, errorMessages: message? [message + ' action'] : null });
			} catch (error) {
				next();
			}
		},
	}
};
