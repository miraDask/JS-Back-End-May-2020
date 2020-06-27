const express = require('express');
const router = express.Router();
const { home } = require('../handlers');

// allow anonymous
router.get('/', home.get.home);

// allow anonymous
router.get('/about', home.get.about);

module.exports = router;
