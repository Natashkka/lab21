const TestMongo = require('../models/TestMongo');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await TestMongo.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await TestMongo.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const newTest = new TestMongo(req.body);
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const updatedTest = await TestMongo.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedTest) return res.status(404).json({ message: 'Тест не найден' });
    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await TestMongo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Тест удален' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const updatedTest = await TestMongo.findByIdAndUpdate(
      req.params.id,
      { $push: { questions: req.body } },
      { new: true }
    );
    if (!updatedTest) return res.status(404).json({ message: 'Тест не найден' });
    res.json({ message: 'Вопрос добавлен!', updatedTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestionInTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const questionId = req.params.questionId; 
    const newQuestionText = req.body.questionText;

    const updatedTest = await TestMongo.findByIdAndUpdate(
      testId,
      { 
        $set: { "questions.$[elem].questionText": newQuestionText } 
      },
      { 
        new: true,
        arrayFilters: [{ "elem._id": questionId }] 
      }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Тест или вопрос не найден' });
    }

    res.json({ message: 'Текст вопроса обновлен!', updatedTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};