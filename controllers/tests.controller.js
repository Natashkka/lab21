// controllers/tests.controller.js
const { Test, User } = require('../models');

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

// POST /generate — генерация теста «ИИ» с лимитом
exports.generateTest = async (req, res) => {
    try {
        const { topic, questionCount = 3 } = req.body;

        // 1. Валидация
        if (!topic) {
            return res.status(400).json({ success: false, message: 'Укажите тему' });
        }
        if (questionCount < 1 || questionCount > 20) {
            return res.status(400).json({ success: false, message: 'Количество вопросов от 1 до 20' });
        }

        // 2. Получить пользователя
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        // 3. Сброс счётчика при новом дне
        const today = new Date().toISOString().split('T')[0];   // YYYY-MM-DD
        if (user.lastGenerationDate !== today) {
            user.aiGenerationsToday = 0;
            user.lastGenerationDate = today;
        }

        // 4. Проверка лимита (не для админов)
        if (user.role !== 'admin' && user.aiGenerationsToday >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Лимит ИИ-генераций исчерпан (3 в день). Попробуйте завтра'
            });
        }

        // 5. Увеличить счётчик
        user.aiGenerationsToday += 1;
        await user.save();

        // 6. Генерация (как было)
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

        res.status(201).json({
            success: true,
            message: 'Тест сгенерирован',
            data: newTest,
            remainingToday: user.role === 'admin' ? 'unlimited' : 3 - user.aiGenerationsToday
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};