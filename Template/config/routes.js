const routers = require('../routers');

module.exports = (app) => {
	app.use('/user', routers.users);

	app.use('/', routers.home);

	app.use('/example', routers.example);

	app.get('*', (req, res) => {
		const { isLoggedIn } = req;
		const username = req.user ? req.user.username : '';
		res.render('404', { isLoggedIn, username });
	});
};