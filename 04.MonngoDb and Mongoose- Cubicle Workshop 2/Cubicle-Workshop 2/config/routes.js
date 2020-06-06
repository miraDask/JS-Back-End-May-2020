const cubesController = require('../controllers/cubes');

module.exports = (app) => {
	app.get('/', cubesController.getIndex);

	app.get('/about', cubesController.getAbout);

	app.get('/details/:id', cubesController.getDetails);

	app.get('/create', cubesController.getCreate);

	app.post('/create', cubesController.postCreate);

	app.get('*', (req, res) => {
		res.render('404');
	});
};
