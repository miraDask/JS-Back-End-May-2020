const express = require('express');
const router = express.Router();
const { users } = require('../controllers');
const { anonymousRestriction } = require('../controllers/auth');

// allow anonymous
router.get('/login', users.get.login);

// allow anonymous
router.post('/login', users.post.login);

// allow anonymous
router.get('/register', users.get.register);

// allow anonymous
router.post('/register', users.post.register);

router.get('/logout', anonymousRestriction, users.get.logout);

module.exports = router;
