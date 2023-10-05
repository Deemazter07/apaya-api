// routes/articles.route.js
const express = require('express');
const router = express.Router();
const ArticlesController = require('../controllers/articles.controller');
const { verifyJwtAuth } = require('../middleware/auth.middleware');
const uploadFile = require("../middleware/multer.middleware")

// Create Articles
router.post('/', verifyJwtAuth, uploadFile.single("thumbnail"), ArticlesController.createArticles);

// Find Articles
router.get('/', ArticlesController.findArticles);

// Get Articles
router.get('/:uuid', ArticlesController.getArticleById);

module.exports = router;