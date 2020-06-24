const routers = require('../routers');
const { EMAIL } = require('../controllers/constants');

module.exports = (app) => {
	// allow anonymous
	app.use('/', routers.home);

	// allow anonymous
	app.use('/user', routers.users);

	app.use('/tripps', routers.tripps);

	app.get('*', (req, res) => {
		const { isLoggedIn } = req;
		const loggedEmail = req.cookies[EMAIL];
		res.render('404', { isLoggedIn, loggedEmail });
	});
};
