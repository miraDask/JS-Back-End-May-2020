const routers = require('../routers');

const accessoriesController = require('../controllers/accessories');
const usersController = require('../controllers/users');
const { anonymousRestriction, isCubeCreatorCheck, notCreatorRestriction } = require('../controllers/auth');

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
