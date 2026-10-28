const TestMongo = require('../models/TestMongo');

// Получить все тесты
exports.getAllTests = async (req, res) => {
  try {
    const tests = await TestMongo.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить тест по ID
exports.getTestById = async (req, res) => {
  try {
    const test = await TestMongo.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создать тест
exports.createTest = async (req, res) => {
  try {
    const newTest = new TestMongo(req.body);
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Обновить тест
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

// Удалить тест
exports.deleteTest = async (req, res) => {
  try {
    await TestMongo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Тест удален' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Добавить вопрос в тест (Часть 6)
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

// Обновление конкретного вопроса внутри массива (Часть 6)
exports.updateQuestionInTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const questionId = req.params.questionId; // ID вопроса, который хотим изменить
    const newQuestionText = req.body.questionText; // Новый текст вопроса

    const updatedTest = await TestMongo.findByIdAndUpdate(
      testId,
      { 
        // $set указывает, что именно менять. 
        // $[elem] — это плейсхолдер для элемента массива, который мы отфильтруем ниже
        $set: { "questions.$[elem].questionText": newQuestionText } 
      },
      { 
        new: true,
        // arrayFilters ищет нужный вопрос внутри массива по его _id
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