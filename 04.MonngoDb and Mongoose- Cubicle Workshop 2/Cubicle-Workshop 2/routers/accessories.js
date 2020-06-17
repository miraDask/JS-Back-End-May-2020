const express = require('express');
const router = express.Router();
const { accessories } = require('../controllers');
const { anonymousRestriction, notCreatorRestriction } = require('../controllers/auth');

router.get('/create/accessory', anonymousRestriction, accessories.get.create);

router.post('/create/accessory', anonymousRestriction, accessories.post.create);

router.get('/attach/accessory/:id', anonymousRestriction, notCreatorRestriction, accessories.get.attach);

router.post('/attach/accessory/:id', anonymousRestriction, notCreatorRestriction, accessories.post.attach);

module.exports = router;
