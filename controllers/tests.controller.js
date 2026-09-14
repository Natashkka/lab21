// controllers/tests.controller.js
const { Test } = require('../models');

// GET /tests — все тесты
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.findAll();
        res.json({ success: true, count: tests.length, data: tests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /tests/:id — тест по ID
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ success: false, message: 'Тест не найден' });
        }
        res.json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /tests — создать тест
exports.createTest = async (req, res) => {
    try {
        const { title, topic, questions } = req.body;
        if (!title || !topic) {
            return res.status(400).json({ success: false, message: 'Укажите title и topic' });
        }
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'Добавьте хотя бы один вопрос' });
        }
        const newTest = await Test.create({ title, topic, questions, generatedByAI: false });
        res.status(201).json({ success: true, message: 'Тест создан', data: newTest });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /tests/:id — обновить тест
exports.updateTest = async (req, res) => {
    try {
        const { title, topic, questions } = req.body;
        if (!title || !topic) {
            return res.status(400).json({ success: false, message: 'Укажите title и topic' });
        }
        const [updated] = await Test.update(
            { title, topic, questions },
            { where: { id: req.params.id } }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Тест не найден' });
        }
        const test = await Test.findByPk(req.params.id);
        res.json({ success: true, message: 'Тест обновлён', data: test });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /tests/:id — удалить тест
exports.deleteTest = async (req, res) => {
    try {
        const deleted = await Test.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Тест не найден' });
        }
        res.json({ success: true, message: 'Тест удалён' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /generate — генерация теста «ИИ»
exports.generateTest = async (req, res) => {
    try {
        const { topic, questionCount = 3 } = req.body;
        if (!topic) {
            return res.status(400).json({ success: false, message: 'Укажите тему' });
        }
        if (questionCount < 1 || questionCount > 20) {
            return res.status(400).json({ success: false, message: 'Количество вопросов от 1 до 20' });
        }
        const questions = [];
        for (let i = 0; i < questionCount; i++) {
            questions.push({
                question: `Вопрос ${i + 1} по теме "${topic}"?`,
                options: ['Вариант А', 'Вариант Б', 'Вариант В'],
                correctAnswer: 0
            });
        }
        const newTest = await Test.create({
            title: `Тест: ${topic}`,
            topic,
            questions,
            generatedByAI: true
        });
        res.status(201).json({ success: true, message: 'Тест сгенерирован', data: newTest });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};