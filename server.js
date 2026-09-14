// server.js
const express = require('express');
const app = express();

// middleware
app.use(express.json());

// маршруты
const testsRoutes = require('./routes/tests.routes');
app.use('/tests', testsRoutes);

// генерация «ИИ» — отдельный маршрут
const testsController = require('./controllers/tests.controller');
app.post('/generate', testsController.generateTest);

// 404 — маршрут не найден
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Маршрут ${req.method} ${req.url} не найден`
    });
});

// глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// запуск
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📋 GET    /tests         - все тесты`);
    console.log(` GET    /tests/:id     - тест по ID`);
    console.log(` POST   /tests         - создать тест`);
    console.log(` PUT    /tests/:id     - обновить тест`);
    console.log(` DELETE /tests/:id     - удалить тест`);
    console.log(` POST   /generate      - генерация ИИ`);
});