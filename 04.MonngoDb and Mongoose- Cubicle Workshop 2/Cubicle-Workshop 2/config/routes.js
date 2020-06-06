const cubesController = require('../controllers/cubes');
const accessoriesController = require('../controllers/accessory');

module.exports = (app) => {
	app.get('/', cubesController.getIndex);

	app.get('/about', cubesController.getAbout);

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
