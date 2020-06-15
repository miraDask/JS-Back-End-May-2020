const cubesController = require('../controllers/cubes');
const accessoriesController = require('../controllers/accessory');
const usersController = require('../controllers/users');
const { anonymousRestriction } = require('../controllers/auth');

module.exports = (app) => {
	// allow anonymous
	app.get('/', cubesController.getIndex);

	// allow anonymous
	app.get('/about', cubesController.getAbout);

	// allow anonymous
	app.get('/login', usersController.getLogin);

	// allow anonymous
	app.post('/login', usersController.postLogin);

	// allow anonymous
	app.get('/register', usersController.getRegister);

	// allow anonymous
	app.post('/register', usersController.postRegister);

	app.get('/logout', anonymousRestriction, usersController.getLogout);

	// allow anonymous
	app.get('/details/:id', cubesController.getDetails);

	app.get('/create', anonymousRestriction, cubesController.getCreate);

	app.post('/create', anonymousRestriction, cubesController.postCreate);

	app.get('/edit/:id', anonymousRestriction, cubesController.getEdit);

	app.post('/edit/:id', anonymousRestriction, cubesController.postEdit);

	app.get('/delete/:id', anonymousRestriction, cubesController.getDelete);

	app.post('/delete/:id', anonymousRestriction, cubesController.postDelete);

	app.get('/create/accessory', anonymousRestriction, accessoriesController.getCreate);

	app.post('/create/accessory', anonymousRestriction, accessoriesController.postCreate);

	app.get('/attach/accessory/:id', anonymousRestriction, accessoriesController.getAttach);

	app.post('/attach/accessory/:id', anonymousRestriction, accessoriesController.postAttach);

	app.get('*', (req, res) => {
		res.render('404');
	});
};
