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
		notAttachedAccessories = await getUnAttachedToCurrentCubeAccessories(cubeId);
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
		await updateAccessory(cubeId, accessory);
		res.redirect(`/details/${cubeId}`);
	} catch (error) {
		console.error(error);
	}
};

const updateAccessory = async (cubeId, accessoryId) => {
	await Accessory.findByIdAndUpdate(accessoryId, {
		$addToSet: {
			cubes: [ cubeId ]
		}
	});
};

const getUnAttachedToCurrentCubeAccessories = async (cubeId) => {
	return await Accessory.find({
		cubes: {
			$not: { $regex: cubeId }
		}
	})
		.select('_id name')
		.lean();
};

module.exports = {
	getCreate,
	postCreate,
	getAttach,
	postAttach
};
