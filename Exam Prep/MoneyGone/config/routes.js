const routers = require('../routers');

module.exports = (app) => {
	// allow anonymous
	app.use('/user', routers.users);

	app.use('/', routers.home);

	app.use('/expenses', routers.expenses);

	app.get('*', (req, res) => {
		const { isLoggedIn } = req;
		const username = req.user ? req.user.username : '';
		res.render('404', { isLoggedIn, username });
	});
};
