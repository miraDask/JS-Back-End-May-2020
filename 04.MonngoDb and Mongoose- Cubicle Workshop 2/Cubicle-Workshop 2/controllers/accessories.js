const cubesService = require('../services/cubes');
const accessoriesService = require('../services/accessories');

module.exports = {
	get: {
		create: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('createAccessory', { isLoggedIn });
		},
		attach: async (req, res, next) => {
			try {
				const cubeId = req.params.id;
				const cube = await cubesService.getCubeById(cubeId);
				notAttachedAccessories = await accessoriesService.getUnAttachedToCurrentCubeAccessories(cubeId);
				const { isLoggedIn } = req;
				res.render('attachAccessory', { ...cube, notAttachedAccessories, isLoggedIn });
			} catch (error) {
				console.error(error);
			}
		}
	},

	post: {
		create: async (req, res, next) => {
			try {
				const { name, description, imageUrl } = req.body;
				await accessoriesService.createAccessory({ name, description, imageUrl });
				res.redirect('/');
			} catch (error) {
				console.error(error);
			}
		},

		attach: async (req, res, next) => {
			const { accessory } = req.body;
			const cubeId = req.params.id;
			try {
				await cubesService.attachAccessory(cubeId, accessory);
				await accessoriesService.updateAccessory(cubeId, accessory);
				res.redirect(`/details/${cubeId}`);
			} catch (error) {
				console.error(error);
			}
		}
	}
};
