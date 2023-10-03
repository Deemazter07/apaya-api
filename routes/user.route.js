// routes/user.route.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// Create a new user
router.post('/', UserController.createUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by uuid
router.get("/:uuid", UserController.getUserById)

module.exports = router;