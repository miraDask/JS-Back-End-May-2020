const express = require('express');
const router = express.Router();
const { courses } = require('../controllers');
const { authenticationCheck, isCreatorCheck, isEnrolledCheck } = require('../utils/auth');

router.get('/create', authenticationCheck, courses.get.create);
router.post('/create', authenticationCheck, courses.post.create);
router.get('/enroll/:id', courses.get.enroll);
// router.get('/course/edit/:id')
// router.post('/course/edit/:id')
// router.get('/course/delete/:id')

router.get('/details/:id', authenticationCheck, isCreatorCheck, isEnrolledCheck, courses.get.details);

module.exports = router;
