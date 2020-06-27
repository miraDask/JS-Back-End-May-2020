const express = require('express');
const router = express.Router();
const { home } = require('../handlers');

// allow anonymous
router.get('/', home.get.home);

module.exports = router;
