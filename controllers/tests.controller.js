// controllers/tests.controller.js
const TestModel = require('../models/tests.model');

// GET /tests — все тесты
exports.getAllTests = (req, res) => {
    const tests = TestModel.getAll();
    res.json({
        success: true,
        count: tests.length,
        data: tests
    });
};

// GET /tests/:id — тест по ID
exports.getTestById = (req, res) => {
    const id = parseInt(req.params.id);
    const test = TestModel.getById(id);

    if (!test) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }

    res.json({ success: true, data: test });
};

// POST /tests — создать тест
exports.createTest = (req, res) => {
    const { title, topic, questions } = req.body;

    if (!title || !topic) {
        return res.status(400).json({
            success: false,
            message: 'Укажите title и topic'
        });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Добавьте хотя бы один вопрос'
        });
    }

    const newTest = TestModel.create({ title, topic, questions });

    res.status(201).json({
        success: true,
        message: 'Тест создан',
        data: newTest
    });
};

// PUT /tests/:id — обновить тест
exports.updateTest = (req, res) => {
    const id = parseInt(req.params.id);
    const { title, topic, questions } = req.body;

    if (!title || !topic) {
        return res.status(400).json({
            success: false,
            message: 'Укажите title и topic'
        });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Добавьте хотя бы один вопрос'
        });
    }

    const updated = TestModel.update(id, { title, topic, questions });

    if (!updated) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }

    res.json({
        success: true,
        message: 'Тест обновлён',
        data: updated
    });
};

// DELETE /tests/:id — удалить тест
exports.deleteTest = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = TestModel.remove(id);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }

    res.json({
        success: true,
        message: 'Тест удалён',
        data: deleted
    });
};

// POST /generate — генерация теста «ИИ»
exports.generateTest = (req, res) => {
    const { topic, questionCount = 3 } = req.body;

    if (!topic) {
        return res.status(400).json({
            success: false,
            message: 'Укажите тему для генерации'
        });
    }

    if (questionCount < 1 || questionCount > 20) {
        return res.status(400).json({
            success: false,
            message: 'Количество вопросов должно быть от 1 до 20'
        });
    }

    const questions = [];
    for (let i = 0; i < questionCount; i++) {
        questions.push({
            question: `Вопрос ${i + 1} по теме "${topic}"?`,
            options: ['Вариант А', 'Вариант Б', 'Вариант В'],
            correctAnswer: 0
        });
    }

    const newTest = TestModel.create({
        title: `Тест: ${topic}`,
        topic,
        questions,
        generatedByAI: true
    });

    res.status(201).json({
        success: true,
        message: 'Тест сгенерирован',
        data: newTest
    });
};