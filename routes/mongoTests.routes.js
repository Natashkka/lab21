const express = require('express');
const router = express.Router();
const mongoTestController = require('../controllers/mongoTest.controller');

router.get('/', mongoTestController.getAllTests);
router.get('/:id', mongoTestController.getTestById);
router.post('/', mongoTestController.createTest);
router.put('/:id', mongoTestController.updateTest);
router.delete('/:id', mongoTestController.deleteTest);

router.post('/:id/questions', mongoTestController.addQuestion);

router.put('/:id/questions/:questionId', mongoTestController.updateQuestionInTest);
module.exports = router;