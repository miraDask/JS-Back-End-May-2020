const coursesService = require('../services/courses');
const { getUserId } = require('../utils/auth');
const { TOKEN_KEY } = require('../controllers/constants');
const { response } = require('express');

module.exports = {
	get: {
		create: async (req, res, next) => {
			try {
				const { isLoggedIn, username } = req;

				res.render('create-course', { isLoggedIn, username });
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
				await coursesService.enrollUser(courseId, userId);
				res.redirect(`/course/details/${courseId}`);
			} catch (error) {
				next();
			}
		},
		delete: async (req, res, next) => {
			try {
				const courseId = req.params.id;
				await coursesService.deleteCourse(courseId);
				res.redirect('/');
			} catch (error) {
				next();
			}
		},
		edit: async (req, res, next) => {
			try {
				const { isLoggedIn, username } = req;
				const courseId = req.params.id;
				const course = await coursesService.getCourseWithEnrolledUsersById(courseId);
				res.render('edit-course', { isLoggedIn, username, ...course });
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
		},
		edit: async (req, res, next) => {
			const id = req.params.id;
			const { isLoggedIn, username } = req;
			const { title, description, imageUrl, checked } = req.body;
			const isPublic = !!checked;
			const updateResult = await coursesService.editCourse(id, { title, description, imageUrl, isPublic });

			if (!updateResult.success) {
				res.render('edit-course', { isLoggedIn, username, title, description, imageUrl, isPublic, id });
			} else {
				res.redirect(`/course/details/${id}`);
			}
		}
	}
};
