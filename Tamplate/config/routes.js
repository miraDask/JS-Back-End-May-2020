const routers = require('../routers');

module.exports = (app) => {
	// allow anonymous
	app.use('/user', routers.users);

	app.use('/', routers.home);

	app.get('*', (req, res) => {
		res.render('404');
	});
};
