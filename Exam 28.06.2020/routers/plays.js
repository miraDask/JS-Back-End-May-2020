const express = require('express');
const router = express.Router();
const { plays } = require('../handlers');
const { anonymousRestriction, notCreatorRestriction, alreadyLikedRestriction } = require('../utils/auth');
const { validateCreate, validateEdit } = require('../utils/validator');

router.get('/create', anonymousRestriction, plays.get.create);
router.post('/create', anonymousRestriction, validateCreate, plays.post.create);
router.get('/like/:id', anonymousRestriction, alreadyLikedRestriction, plays.get.like);

router.get('/details/:id', anonymousRestriction, plays.get.details);
router.get('/delete/:id', anonymousRestriction, notCreatorRestriction, plays.get.delete);
router.get('/edit/:id', anonymousRestriction, notCreatorRestriction, plays.get.edit);
router.post('/edit/:id', anonymousRestriction, notCreatorRestriction, validateEdit, plays.post.edit);

module.exports = router;
