// TODO: Require Controllers...
const cubes = require('../config/database.json');
module.exports = (app) => {
	app.get('/', (req, res) => {
		res.render('index', { cubes });
	});

	app.get('/about', (req, res) => {
		res.render('about');
	});

	app.get('/create', (req, res) => {
		res.render('create');
	});

	app.get('/details/:id', (req, res) => {
		res.render(
			'details',
			({ name, description, imageUrl, difficulty } = cubes.filter((x) => x.id === '5c3a68d9f78d6638ec8fdad7')[0])
		);
	});

	app.get('*', (req, res) => {
		res.render('404');
	});
};
