const express = require('express');
const router = express.Router();
const { cubes } = require('../controllers');
const { anonymousRestriction, isCubeCreatorCheck, notCreatorRestriction } = require('../utils/auth');

// allow anonymous
router.get('/details/:id', isCubeCreatorCheck, cubes.get.details);

router.get('/create', anonymousRestriction, cubes.get.create);

router.post('/create', anonymousRestriction, cubes.post.create);

router.get('/edit/:id', anonymousRestriction, notCreatorRestriction, cubes.get.edit);

router.post('/edit/:id', anonymousRestriction, notCreatorRestriction, cubes.post.edit);

router.get('/delete/:id', anonymousRestriction, notCreatorRestriction, cubes.get.delete);

router.post('/delete/:id', anonymousRestriction, notCreatorRestriction, cubes.post.delete);

module.exports = router;
