// middleware/isAdmin.js
module.exports = (req, res, next) => {
    // req.user уже заполнен middleware authMiddleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Доступ запрещён. Требуются права администратора'
        });
    }
    next();
};