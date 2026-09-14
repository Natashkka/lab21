// routes/tests.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/tests.controller');

// CRUD для тестов
router.get('/', controller.getAllTests);
router.get('/:id', controller.getTestById);
router.post('/', controller.createTest);
router.put('/:id', controller.updateTest);
router.delete('/:id', controller.deleteTest);

module.exports = router;