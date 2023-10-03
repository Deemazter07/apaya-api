// routes/auth.route.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyJwtAuth } = require('../middleware/auth.middleware');

// Auth Login
router.post('/login', AuthController.authLogin);
// Auth Me
router.post('/me', verifyJwtAuth, AuthController.authMe);

module.exports = router;