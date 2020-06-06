const Accessory = require('../models/accessoryModel');
const Cube = require('../models/cubeModel');
const { updateCube } = require('../controllers/cubes');

const getCreate = (req, res) => {
	res.render('createAccessory');
};

const postCreate = async (req, res) => {
	console.log(req.body);
	const { name, description, imageUrl } = req.body;
	const newAccessory = new Accessory({ name, description, imageUrl });

	try {
		await newAccessory.save();
		res.redirect('/');
	} catch (error) {
		console.error(error);
	}
};

const getAttach = async (req, res) => {
	try {
		const cubeId = req.params.id;
		const cube = await Cube.findById(cubeId).lean();
		const cubeAccessories = cube.accessories.map((x) => x.valueOf().toString());
		const accessories = await Accessory.find().select('_id name').lean();
		const notAttachedAccessories = accessories.filter((x) => {
			const accessoryIdToString = x._id.valueOf().toString();
			return !cubeAccessories.includes(accessoryIdToString);
		});
		res.render('attachAccessory', { ...cube, notAttachedAccessories });
	} catch (error) {
		console.error(error);
	}
};

const postAttach = async (req, res) => {
	const { accessory } = req.body;
	const cubeId = req.params.id;
	console.log(cubeId);
	try {
		await updateCube(cubeId, accessory);
		res.redirect(`/details/${cubeId}`);
	} catch (error) {
		consol.error(error);
	}
};

module.exports = {
	getCreate,
	postCreate,
	getAttach,
	postAttach
};
