const express = require('express');
const router = express.Router();
const { expenses } = require('../controllers');
const { anonymousRestriction } = require('../utils/auth');

// allow anonymous
router.get('/create', anonymousRestriction, expenses.get.create);
router.get('/report/:id', anonymousRestriction, expenses.get.report);
router.get('/delete/:id', anonymousRestriction, expenses.get.delete);
// allow anonymous
router.post('/create', anonymousRestriction, expenses.post.create);

module.exports = router;
