const express = require('express');
const router = express.Router();
const controller = require('../controllers/tests.controller');
const authMiddleware = require('../middleware/auth');
const isAdminMiddleware = require('../middleware/isAdmin');

// Публичные — доступны всем
router.get('/', controller.getAllTests);
router.get('/:id', controller.getTestById);

// Только для админов
router.post('/', authMiddleware, isAdminMiddleware, controller.createTest);
router.put('/:id', authMiddleware, isAdminMiddleware, controller.updateTest);
router.delete('/:id', authMiddleware, isAdminMiddleware, controller.deleteTest);

module.exports = router;