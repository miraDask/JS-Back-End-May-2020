const coursesService = require('../services/courses');
const { getUserId } = require('../utils/auth');
const { TOKEN_KEY } = require('../controllers/constants');

module.exports = {
	get: {
		create: async (req, res, next) => {
			try {
				const { isLoggedIn, username } = req;

				res.render('create-course', { isLoggedIn, username, courses });
			} catch (error) {
				next();
			}
		},
		details: async (req, res, next) => {
			try {
				const { isLoggedIn, username } = req;
				const isCreator = req.isCreator;
				const isEnrolled = req.isEnrolled;
				const courseId = req.params.id;
				const course = await coursesService.getCourseWithEnrolledUsersById(courseId);

				res.render('course-details', { isLoggedIn, username, ...course, isCreator, isEnrolled });
			} catch (error) {
				next();
			}
		},
		enroll: async (req, res, next) => {
			try {
				const courseId = req.params.id;
				const token = req.cookies[TOKEN_KEY];
				const userId = getUserId(token);
				var x = await coursesService.enrollUser(courseId, userId);
				res.redirect(`/course/details/${courseId}`);
			} catch (error) {
				next();
			}
		}
	},
	post: {
		create: async (req, res, next) => {
			const { title, description, imageUrl, checked } = req.body;
			const isPublic = !!checked;
			const token = req.cookies[TOKEN_KEY];
			const creatorId = getUserId(token);
			const creationResult = await coursesService.createCourse({
				title,
				description,
				imageUrl,
				isPublic,
				creatorId
			});

			if (!creationResult.success) {
				const { isLoggedIn, username } = req;
				const { errorMessages } = creationResult;
				res.render('create-course', {
					isLoggedIn,
					username,
					errorMessages,
					title,
					description,
					imageUrl,
					checked
				});
			} else {
				const { _id } = creationResult;
				res.redirect(`/course/details/${_id}`);
			}
		}
	}
};
