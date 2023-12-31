const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const articlesRoutes = require('./articles.route');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/articles', articlesRoutes)

module.exports = router;