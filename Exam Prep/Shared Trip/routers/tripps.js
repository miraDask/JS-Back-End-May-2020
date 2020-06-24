const express = require('express');
const router = express.Router();
const { tripps } = require('../controllers');
const { anonymousRestriction, notCreatorRestriction } = require('../utils/auth');

router.get('/', anonymousRestriction, tripps.get.all);
router.get('/create', anonymousRestriction, tripps.get.create);
router.get('/details/:id', anonymousRestriction, tripps.get.details);
router.get('/close/:id', anonymousRestriction, notCreatorRestriction, tripps.get.delete);
router.get('/join/:id', anonymousRestriction, tripps.get.join);

router.post('/create', anonymousRestriction, tripps.post.create);

module.exports = router;
