// const Cube = require('../models/courseModel');

// module.exports = {
// 	createCube: async (cubeObject) => {
// 		const newCube = new Cube(cubeObject);
// 		try {
// 			const { _id } = await newCube.save();
// 			return {
// 				success: true,
// 				_id
// 			};
// 		} catch (error) {
// 			const errorMessages = [];
// 			Object.keys(error.errors).forEach((x) => {
// 				errorMessages.push(error.errors[x].message);
// 			});

// 			return {
// 				success: false,
// 				errorMessages
// 			};
// 		}
// 	},

// 	editCube: async (cubeId, cubeObject) => await Cube.findByIdAndUpdate(cubeId, cubeObject),

// 	deleteCube: async (cubeId) => await Cube.findByIdAndRemove(cubeId),

// 	getCubeById: async (id) => await Cube.findById(id).lean(),

// 	getCubeWithAccessoriesById: async (id) => await Cube.findById(id).populate('accessories').lean(),

// 	getCubeCreator: async (id) => {
// 		const { creatorId } = await Cube.findById(id).select('creatorId');
// 		return creatorId;
// 	},

// 	getAllCubes: async (search, from, to) => {
// 		let query = Cube.find();

// 		if (search) {
// 			query = Cube.find({ name: { $regex: search, $options: 'i' } });
// 		}

// 		if (from) {
// 			query = query.where('difficulty').gte(from);
// 		}

// 		if (to) {
// 			query = query.where('difficulty').lte(to);
// 		}

// 		return await query.lean();
// 	},

// 	attachAccessory: async (cubeId, accessoryId) => {
// 		await Cube.findByIdAndUpdate(cubeId, {
// 			$addToSet: {
// 				accessories: [ accessoryId ]
// 			}
// 		});
// 	}
// };
