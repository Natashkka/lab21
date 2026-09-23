// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// POST /auth/register — регистрация
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Валидация
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Укажите email и password'
            });
        }

        // 2. Проверка уникальности email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        // 3. Хеширование пароля
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Создание пользователя
        const user = await User.create({ email, passwordHash });

        // 5. Ответ 201
        res.status(201).json({
            success: true,
            message: 'Пользователь зарегистрирован',
            data: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// POST /auth/login — вход
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Валидация
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Укажите email и password'
            });
        }

        // 2. Поиск пользователя по email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // 3. Сравнение пароля с хешем
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // 4. Генерация JWT
        const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },   // ← добавь role
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

        // 5. Ответ с токеном
        res.json({
            success: true,
            message: 'Вход выполнен',
            token
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /auth/profile — данные текущего пользователя
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
