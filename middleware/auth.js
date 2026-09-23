// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Извлекаем токен из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Токен не предоставлен'
            });
        }

        // 2. Достаём токен (убираем "Bearer ")
        const token = authHeader.split(' ')[1];

        // 3. Верифицируем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Прикрепляем данные пользователя к запросу
        req.user = decoded;

        // 5. Пропускаем к контроллеру
        next();
    } catch (err) {
        // Ошибка при верификации (неверный токен, истёк срок и т.д.)
        return res.status(401).json({
            success: false,
            message: 'Неверный или истёкший токен'
        });
    }
};