const express = require('express');
const app = express();

app.use(express.json());

// данные
let tests = [
    {
        id: 1,
        title: 'Основы JavaScript',
        topic: 'JavaScript',
        questions: [
            {
                question: 'Что такое замыкание?',
                options: ['Функция внутри функции', 'Объект с методами', 'Массив функций'],
                correctAnswer: 0
            }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Основы Node.js',
        topic: 'Node.js',
        questions: [
            {
                question: 'Что такое Event Loop?',
                options: ['Цикл событий', 'База данных', 'Фреймворк'],
                correctAnswer: 0
            }
        ],
        createdAt: new Date().toISOString()
    }
];

let nextId = 3;

// маршруты
// GET все тесты
app.get('/tests', (req, res) => {
    res.json({
        success: true,
        count: tests.length,
        data: tests
    });
});

// GET тест по ID
app.get('/tests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    // элемент не найден
    const test = tests.find(t => t.id === id);
    if (!test) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }
    
    res.json({ success: true, data: test });
});

// POST создать тест
app.post('/tests', (req, res) => {
    const { title, topic, questions } = req.body;

    // неверные данные запроса
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

    const newTest = {
        id: nextId++,
        title,
        topic,
        questions,
        createdAt: new Date().toISOString()
    };

    tests.push(newTest);
    res.status(201).json({
        success: true,
        message: 'Тест создан',
        data: newTest
    });
});

// PUT обновить тест
app.put('/tests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tests.findIndex(t => t.id === id);

    //элемент не найден
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }

    const { title, topic, questions } = req.body;

    //неверные данные запроса
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

    tests[index] = {
        ...tests[index],
        title,
        topic,
        questions,
        updatedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Тест обновлен',
        data: tests[index]
    });
});

// DELETE удалить тест
app.delete('/tests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tests.findIndex(t => t.id === id);

    // элемент не найден
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Тест с ID ${id} не найден`
        });
    }

    const deleted = tests.splice(index, 1);
    res.json({
        success: true,
        message: 'Тест удален',
        data: deleted[0]
    });
});

// генерация тестов ии
app.post('/generate', (req, res) => {
    const { topic, questionCount = 3 } = req.body;

    //неверные данные запроса
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

    const newTest = {
        id: nextId++,
        title: `Тест: ${topic}`,
        topic,
        questions,
        generatedByAI: true,
        createdAt: new Date().toISOString()
    };

    tests.push(newTest);
    res.status(201).json({
        success: true,
        message: 'Тест сгенерирован',
        data: newTest
    });
});

// ОБРАБОТКА 404 - МАРШРУТ НЕ НАЙДЕН
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Маршрут ${req.method} ${req.url} не найден`
    });
});

// ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК (error-handling middleware)

app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

//запуск

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📋 GET    /tests         - все тесты`);
    console.log(`📋 GET    /tests/:id     - тест по ID`);
    console.log(`📋 POST   /tests         - создать тест`);
    console.log(`📋 PUT    /tests/:id     - обновить тест`);
    console.log(`📋 DELETE /tests/:id     - удалить тест`);
    console.log(`📋 POST   /generate      - генерация ИИ`);
});