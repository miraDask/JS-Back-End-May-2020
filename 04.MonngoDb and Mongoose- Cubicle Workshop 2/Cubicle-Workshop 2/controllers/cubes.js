const cubesService = require('../services/cubes');

const { getUserId } = require('../controllers/auth');

const { TOKEN_KEY } = require('../controllers/constants');

module.exports = {
	get: {
		create: (req, res, next) => {
			const { isLoggedIn } = req;
			res.render('create', { isLoggedIn });
		},

		edit: async (req, res, next) => {
			try {
				const cube = await cubesService.getCubeById(req.params.id);
				const { isLoggedIn } = req;
				res.render('editCubePage', { ...cube, isLoggedIn });
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		delete: async (req, res, next) => {
			try {
				const cube = await cubesService.getCubeById(req.params.id);
				const { isLoggedIn } = req;
				res.render('deleteCubePage', { ...cube, isLoggedIn });
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		details: async (req, res, next) => {
			const { isLoggedIn, isCreator } = req;
			try {
				const cube = await cubesService.getCubeWithAccessoriesById(req.params.id);
				res.render('details', { ...cube, isLoggedIn, isCreator });
			} catch (error) {
				console.error(error);
				throw error;
			}
		}
	},

	post: {
		create: async (req, res, next) => {
			try {
				const token = req.cookies[TOKEN_KEY];
				const { name, description, imageUrl, difficulty } = req.body;
				const creatorId = getUserId(token);
				const _id = await cubesService.createCube({ name, description, imageUrl, difficulty, creatorId });
				res.redirect(`/details/${_id}`);
			} catch (error) {
				console.error(error);
			}
		},

		edit: async (req, res, next) => {
			const { name, description, imageUrl, difficulty } = req.body;
			const cubeId = req.params.id;
			try {
				await cubesService.editCube(cubeId, { name, description, imageUrl, difficulty });
				res.redirect(`/details/${cubeId}`);
			} catch (error) {
				console.error(error);
			}
		},

		delete: async (req, res, next) => {
			const cubeId = req.params.id;
			try {
				await cubesService.deleteCube(cubeId);
				res.redirect('/');
			} catch (error) {
				console.error(error);
			}
		}
	}
};
