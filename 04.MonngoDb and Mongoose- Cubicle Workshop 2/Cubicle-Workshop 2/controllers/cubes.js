const Cube = require('../models/cubeModel');
const { getUserId } = require('../controllers/auth');

const { TOKEN_KEY } = require('../controllers/constants');

const getIndex = async (req, res) => {
	const { search, from, to } = req.query;
	const { isLoggedIn } = req;
	try {
		const cubes = await getAllCubes(search, from, to);
		res.render('index', { cubes, search, from, to, isLoggedIn });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getAbout = (req, res) => {
	const { isLoggedIn } = req;
	res.render('about', { isLoggedIn });
};

const getDetails = async (req, res) => {
	const { isLoggedIn, isCreator } = req;
	try {
		const cube = await getCubeById(req.params.id);
		res.render('details', { ...cube, isLoggedIn, isCreator });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getCreate = (req, res) => {
	const { isLoggedIn } = req;
	res.render('create', { isLoggedIn });
};

const postCreate = async (req, res) => {
	const token = req.cookies[TOKEN_KEY];
	const { name, description, imageUrl, difficulty } = req.body;
	const creatorId = getUserId(token);
	const newCube = new Cube({ name, description, imageUrl, difficulty, creatorId });

	try {
		const { _id } = await newCube.save();
		res.redirect(`/details/${_id}`);
	} catch (error) {
		console.error(error);
	}
};

const getEdit = async (req, res) => {
	try {
		const cube = await getCubeById(req.params.id);
		const { isLoggedIn } = req;
		res.render('editCubePage', { ...cube, isLoggedIn });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const postEdit = async (req, res) => {
	const { name, description, imageUrl, difficulty } = req.body;
	const cubeId = req.params.id;
	try {
		const creatorId = getUserId(token);
		await Cube.findByIdAndUpdate(cubeId, { name, description, imageUrl, difficulty });
		res.redirect(`/details/${cubeId}`);
	} catch (error) {
		console.error(error);
	}
};

const getDelete = async (req, res) => {
	try {
		const cube = await getCubeById(req.params.id);
		const { isLoggedIn } = req;
		res.render('deleteCubePage', { ...cube, isLoggedIn });
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const postDelete = async (req, res) => {
	const cubeId = req.params.id;
	try {
		await Cube.findByIdAndRemove(cubeId);
		res.redirect('/');
	} catch (error) {
		console.error(error);
	}
};

const getCubeById = async (id) => await Cube.findById(id).populate('accessories').lean();

const getCubeCreator = async (id) => {
	const { creatorId } = await Cube.findById(id).select('creatorId');
	return creatorId;
};

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
	updateCube,
	getEdit,
	postEdit,
	getDelete,
	postDelete,
	getCubeCreator
};
