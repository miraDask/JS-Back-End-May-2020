const routers = require('../routers');

module.exports = (app) => {
	// allow anonymous
	app.use('/', routers.users);

	app.use('/', routers.cubes);

	app.use('/', routers.home);

	app.use('/', routers.accessories);

	app.get('*', (req, res) => {
		res.render('404');
	});
};
