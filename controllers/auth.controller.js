// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Укажите email и password'
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({ email, passwordHash });

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

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Укажите email и password'
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

        res.json({
            success: true,
            message: 'Вход выполнен',
            token
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

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
