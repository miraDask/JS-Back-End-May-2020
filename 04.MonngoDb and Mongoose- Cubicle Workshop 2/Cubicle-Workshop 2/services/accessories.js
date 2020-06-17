const Accessory = require('../models/accessoryModel');
const Cube = require('../models/cubeModel');
const { updateCube } = require('../services/cubes');

module.exports = {
	createAccessory: async (accessoryObject) => {
		const newAccessory = new Accessory(accessoryObject);
		await newAccessory.save();
	},

	updateAccessory: async (cubeId, accessoryId) => {
		await Accessory.findByIdAndUpdate(accessoryId, {
			$addToSet: {
				cubes: [ cubeId ]
			}
		});
	},

	getUnAttachedToCurrentCubeAccessories: async (cubeId) => {
		return await Accessory.find({
			cubes: {
				$nin: cubeId
			}
		})
			.select('_id name')
			.lean();
	}
};
