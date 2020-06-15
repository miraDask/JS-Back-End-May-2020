const cubesController = require('../controllers/cubes');
const accessoriesController = require('../controllers/accessory');
const identityController = require('../controllers/identity');

module.exports = (app) => {
	app.get('/', cubesController.getIndex);

	app.get('/about', cubesController.getAbout);

	app.get('/login', identityController.getLogin);

	app.post('/login', identityController.postLogin);

	app.get('/register', identityController.getRegister);

	app.post('/register', identityController.postRegister);

	app.get('/logout', identityController.getLogout);

	app.get('/details/:id', cubesController.getDetails);

	app.get('/create', cubesController.getCreate);

	app.post('/create', cubesController.postCreate);

	app.get('/create/accessory', accessoriesController.getCreate);

	app.post('/create/accessory', accessoriesController.postCreate);

	app.get('/attach/accessory/:id', accessoriesController.getAttach);

	app.post('/attach/accessory/:id', accessoriesController.postAttach);

	app.get('*', (req, res) => {
		res.render('404');
	});
};
