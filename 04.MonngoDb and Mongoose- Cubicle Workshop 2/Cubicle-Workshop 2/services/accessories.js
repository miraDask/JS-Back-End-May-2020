const Accessory = require('../models/accessoryModel');

module.exports = {
	createAccessory: async (accessoryObject) => {
		const newAccessory = new Accessory(accessoryObject);

		try {
			await newAccessory.save();
			return {
				success: true
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
