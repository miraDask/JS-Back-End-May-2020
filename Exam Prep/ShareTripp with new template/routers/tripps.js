const express = require('express');
const router = express.Router();
const { tripps } = require('../handlers');
const { anonymousRestriction, isCreatorCheck, notCreatorRestriction } = require('../utils/auth');
const { validateModel } = require('../utils/validator');

router.get('/create', anonymousRestriction, tripps.get.create);
router.get('/all', anonymousRestriction, tripps.get.all);
router.post('/create', anonymousRestriction, validateModel, tripps.post.create);
router.get('/join/:id', anonymousRestriction, tripps.get.join);
router.get('/details/:id', anonymousRestriction, tripps.get.details);
router.get('/delete/:id', anonymousRestriction, notCreatorRestriction, tripps.get.delete);

module.exports = router;
