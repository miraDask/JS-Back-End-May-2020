const cubeModel = require('../models/cubeModel');

const getIndex = async (req, res) => {
	const { search, from, to } = req.query;
	const predFn = (cube) => {
		let result = true;

		if (search) {
			result = cube.name.toLowerCase().includes(search);
		}

		if (result && from) {
			result = cube.difficulty >= +from;
		}

		if (result && to) {
			result = cube.difficulty <= +to;
		}
		return result;
	};

	const cubes = await cubeModel.find(predFn);
	res.render('index', { cubes, search, from, to });
};

const getAbout = (req, res) => {
	res.render('about');
};

const getDetails = async (req, res) => {
	const cube = await cubeModel.getById(req.params.id);
	res.render('details', { ...cube });
};

const getCreate = (req, res) => {
	res.render('create');
};

const postCreate = async (req, res) => {
	console.log(req.body);
	const { name, description, imageUrl, difficulty } = req.body;
	await cubeModel.create(name, description, imageUrl, difficulty);
	res.redirect('/');
};

module.exports = {
	getIndex,
	getCreate,
	postCreate,
	getAbout,
	getDetails
};
