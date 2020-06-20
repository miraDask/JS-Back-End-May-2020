const express = require('express');
const router = express.Router();
const { courses } = require('../controllers');
const { authenticationCheck, isCreatorCheck, isEnrolledCheck, anonymousRestriction } = require('../utils/auth');

router.get('/create', anonymousRestriction, authenticationCheck, courses.get.create);
router.post('/create', anonymousRestriction, authenticationCheck, courses.post.create);
router.get('/enroll/:id', anonymousRestriction, courses.get.enroll);
router.get('/edit/:id', anonymousRestriction, authenticationCheck, courses.get.edit);
router.post('/edit/:id', anonymousRestriction, courses.post.edit);
router.get('/delete/:id', anonymousRestriction, courses.get.delete);

router.get(
	'/details/:id',
	anonymousRestriction,
	authenticationCheck,
	isCreatorCheck,
	isEnrolledCheck,
	courses.get.details
);

module.exports = router;
