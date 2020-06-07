const Cube = require('../models/cubeModel');

const getIndex = async (req, res) => {
	const { search, from, to } = req.query;
	try {
		const cubes = await getAllCubes(search, from, to);
		res.render('index', { cubes, search, from, to });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getAbout = (req, res) => {
	res.render('about');
};

const getDetails = async (req, res) => {
	try {
		const cube = await getCubeById(req.params.id);
		res.render('details', { ...cube });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getCreate = (req, res) => {
	res.render('create');
};

const postCreate = async (req, res) => {
	const { name, description, imageUrl, difficulty } = req.body;
	const newCube = new Cube({ name, description, imageUrl, difficulty });

	try {
		await newCube.save();
	} catch (error) {
		console.error(error);
	}

	res.redirect('/');
};

const getCubeById = async (id) => await Cube.findById(id).populate('accessories').lean();

const getAllCubes = async (search, from, to) => {
	let query = Cube.find();

	if (search) {
		query = Cube.find({ name: { $regex: search, $options: 'i' } });
	}

	if (from) {
		query = query.where('difficulty').gte(from);
	}

	if (to) {
		query = query.where('difficulty').lte(to);
	}

	return await query.lean();
};

const updateCube = async (cubeId, accessoryId) => {
	await Cube.findByIdAndUpdate(cubeId, {
		$addToSet: {
			accessories: [ accessoryId ]
		}
	});
};

module.exports = {
	getIndex,
	getCreate,
	postCreate,
	getAbout,
	getDetails,
	updateCube
};
