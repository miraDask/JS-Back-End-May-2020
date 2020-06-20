const express = require('express');
const router = express.Router();
const { home } = require('../controllers');

// allow anonymous
router.get('/', home.get.home);

module.exports = router;
