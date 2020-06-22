const routers = require('../routers');
const { USERNAME } = require('../controllers/constants');

module.exports = (app) => {
	// allow anonymous
	app.use('/', routers.users);

	app.use('/', routers.home);

	app.get('*', (req, res) => {
		const { isLoggedIn } = req;
		const username = req.cookies[USERNAME];
		res.render('404', { isLoggedIn, username });
	});
};
