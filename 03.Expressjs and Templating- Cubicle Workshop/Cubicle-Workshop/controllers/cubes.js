const cubeModel = require('../models/cubeModel');

const getIndex = async (req, res) => {
	const cubes = await cubeModel.getAll();
	res.render('index', { cubes });
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

const getAbout = (req, res) => {
	res.render('about');
};

module.exports = {
	getIndex,
	getCreate,
	getAbout,
	postCreate,
	getDetails
};
