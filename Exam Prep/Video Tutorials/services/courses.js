const Course = require('../models/courseModel');
const mongoose = require('mongoose');

const COURSE_EXISTS_MESSAGE = 'Course with this name already exists.';

const createCourse = async (courseObject) => {
	courseObject.createdOn = Date.now();
	const newCourse = new Course(courseObject);
	try {
		const { _id } = await newCourse.save();
		return {
			success: true,
			_id
		};
	} catch (error) {
		const errorMessages = [];
		if (error.name === 'MongoError') {
			errorMessages.push(COURSE_EXISTS_MESSAGE);
		} else {
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});
		}

		return {
			success: false,
			errorMessages
		};
	}
};

const getCreator = async (courseId) => {
	const { creatorId } = await Course.findById(courseId).select('creatorId');
	return creatorId;
};

const IsUserEnrolled = async (courseId, userId) => {
	const course = await getCourseWithEnrolledUsersById(courseId);
	return course.enrolledUsers.some((x) => x._id.equals(mongoose.Types.ObjectId(userId)));
};

const enrollUser = async (courseId, userId) =>
	await Course.findByIdAndUpdate(courseId, {
		$addToSet: {
			enrolledUsers: [ userId ]
		}
	});

const getTopCourses = async (number = null) => {
	let query = Course.find().where('isPublic');
	if (number) {
		query = query.sort({ createdOn: -1 }).limit(number);
	} else {
		query = query.sort({ enrolledUsers: -1 });
	}

	return await query.lean();
};

const editCourse = async (courseId, courseObject) => await Course.findByIdAndUpdate(courseId, courseObject);

const getCourseWithEnrolledUsersById = async (courseId) =>
	await Course.findById(courseId).populate('enrolledUsers').lean();

module.exports = {
	getCourseWithEnrolledUsersById,
	editCourse,
	getTopCourses,
	enrollUser,
	IsUserEnrolled,
	getCreator,
	createCourse
};
