const express = require('express');
const router = express.Router();
const { users } = require('../handlers');
const { anonymousRestriction } = require('../utils/auth');
const { validateUserRegisterInput, validateUserLoginInput } = require('../utils/validator');

// allow anonymous
router.get('/login', users.get.login);

// allow anonymous
router.post('/login', validateUserLoginInput, users.post.login);

// allow anonymous
router.get('/register', users.get.register);

// allow anonymous
router.post('/register', validateUserRegisterInput, users.post.register);

router.get('/logout', anonymousRestriction, users.get.logout);

module.exports = router;
