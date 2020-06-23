const Example = require('../models/exampleModel');

module.exports = {
	create: async (exampleObject) => {
		const newExample = new Example(exampleObject);
		try {
			const { _id } = await newExample.save();
			return {
				success: true,
				_id
			};
		} catch (error) {
			const errorMessages = [];
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});

			return {
				success: false,
				errorMessages
			};
		}
	},

	edit: async (id, exampleObject) => await Example.findByIdAndUpdate(id, exampleObject),

	delete: async (id) => await Example.findByIdAndRemove(id),

	getById: async (id) => await Example.findById(id).lean(),

	//getCubeWithAccessoriesById: async (id) => await Cube.findById(id).populate('accessories').lean(),

	getCreator: async (id) => {
		const { creatorId } = await Example.findById(id).select('creatorId');
		return creatorId;
	},

	getAll: async (search) => {
		let query = Cube.find();

		if (search) {
			query = Cube.find({ name: { $regex: search, $options: 'i' } });
		}

		return await query.lean();
	}

	// attachAccessory: async (cubeId, accessoryId) => {
	// 	await Cube.findByIdAndUpdate(cubeId, {
	// 		$addToSet: {
	// 			accessories: [ accessoryId ]
	// 		}
	// 	});
	//}
};
