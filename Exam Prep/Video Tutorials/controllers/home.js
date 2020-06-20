const coursesService = require('../services/courses');
const title = 'Express Retake Exam January 2019';
const guestCoursesListTitle = 'Courses';
const userCoursesListTitle = 'Top Courses';

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn, username } = req;
			const coursesToDisplay = isLoggedIn ? null : 3;
			const courses = await coursesService.getTopCourses(coursesToDisplay, search);
			const coursesListTitle = isLoggedIn ? userCoursesListTitle : guestCoursesListTitle;
			try {
				res.render('home', { search, isLoggedIn, title, coursesListTitle, username, courses });
			} catch (error) {
				next();
			}
		}
	}
};
