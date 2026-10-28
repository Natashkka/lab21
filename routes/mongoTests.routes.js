const express = require('express');
const router = express.Router();
const mongoTestController = require('../controllers/mongoTest.controller');

// CRUD операции
router.get('/', mongoTestController.getAllTests);
router.get('/:id', mongoTestController.getTestById);
router.post('/', mongoTestController.createTest);
router.put('/:id', mongoTestController.updateTest);
router.delete('/:id', mongoTestController.deleteTest);

// Часть 6: работа с вложенными массивами
router.post('/:id/questions', mongoTestController.addQuestion);

// Обновление элемента внутри массива
router.put('/:id/questions/:questionId', mongoTestController.updateQuestionInTest);
module.exports = router;