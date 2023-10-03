// routes/user.route.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { verifyJwtAuth } = require('../middleware/auth.middleware');

// Create a new user
router.post('/', UserController.createUser);

// Update a new user
router.put('/', verifyJwtAuth, UserController.updateUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by uuid
router.get("/:uuid", UserController.getUserById)

module.exports = router;