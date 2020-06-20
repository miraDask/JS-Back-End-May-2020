const title = 'Express Retake Exam January 2019';
const guestCoursesListTitle = 'Courses';
const userCoursesListTitle = 'Top Courses';

module.exports = {
	get: {
		home: async (req, res, next) => {
			const { search } = req.query;
			const { isLoggedIn, username } = req;
			const coursesListTitle = isLoggedIn ? userCoursesListTitle : guestCoursesListTitle;
			try {
				res.render('home', { search, isLoggedIn, title, coursesListTitle, username });
			} catch (error) {
				next();
			}
		}
	}
};
