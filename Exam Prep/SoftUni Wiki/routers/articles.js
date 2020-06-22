const express = require('express');
const router = express.Router();
const { articles } = require('../controllers');
const { anonymousRestriction, creatorCheck } = require('../utils/auth');

router.get('/create', anonymousRestriction, articles.get.create);
router.get('/', articles.get.list);
router.get('/:id', articles.get.details);
router.get('/edit/:id', anonymousRestriction, articles.get.edit);
router.post('/edit/:id', anonymousRestriction, articles.post.edit);
router.get('/delete/:id', anonymousRestriction, creatorCheck, articles.get.delete);
router.post('/', articles.post.create);

module.exports = router;
