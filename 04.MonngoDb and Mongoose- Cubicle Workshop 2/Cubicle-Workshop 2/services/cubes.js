const Cube = require('../models/cubeModel');

module.exports = {
	createCube: async (cubeObject) => {
		const newCube = new Cube(cubeObject);
		const { _id } = await newCube.save();
		return _id;
	},

	editCube: async (cubeId, cubeObject) => await Cube.findByIdAndUpdate(cubeId, cubeObject),

	deleteCube: async (cubeId) => await Cube.findByIdAndRemove(cubeId),

	getCubeById: async (id) => await Cube.findById(id).lean(),

	getCubeWithAccessoriesById: async (id) => await Cube.findById(id).populate('accessories').lean(),

	getCubeCreator: async (id) => {
		const { creatorId } = await Cube.findById(id).select('creatorId');
		return creatorId;
	},

	getAllCubes: async (search, from, to) => {
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
	},

	attachAccessory: async (cubeId, accessoryId) => {
		await Cube.findByIdAndUpdate(cubeId, {
			$addToSet: {
				accessories: [ accessoryId ]
			}
		});
	}
};
