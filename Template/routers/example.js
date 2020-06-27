const express = require('express');
const router = express.Router();
const { example } = require('../handlers');
const { anonymousRestriction, isCreatorCheck, notCreatorRestriction } = require('../utils/auth');
const { validateModel } = require('../utils/validator');

router.get('/create', anonymousRestriction, example.get.create);
router.post('/create', anonymousRestriction, validateModel, example.post.create);
router.get('/details/:id', anonymousRestriction, isCreatorCheck, example.get.details);
router.get('/delete/:id', anonymousRestriction, notCreatorRestriction, example.get.delete);
router.get('/edit/:id', anonymousRestriction, notCreatorRestriction, example.get.edit);
router.post('/edit/:id', anonymousRestriction, notCreatorRestriction, validateModel, example.post.edit);

module.exports = router;
