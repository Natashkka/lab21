// routes/auth.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

// Регистрация
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authMiddleware, controller.getProfile);

module.exports = router;