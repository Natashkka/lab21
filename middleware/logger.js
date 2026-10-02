const { RequestLog } = require('../models');

module.exports = (req, res, next) => {
    const requestTime = new Date();
    const event = 'HTTP request';
    const requestMethod = req.method;
    const requestUrl = req.originalUrl;

    console.log(
        `[${requestTime.toISOString()}] ${event}: ${requestMethod} ${requestUrl}`
    );

    res.on('finish', async () => {
        try {
            await RequestLog.create({
                requestTime,
                event,
                requestMethod,
                url: requestUrl,
                statusCode: res.statusCode
            });
        } catch (error) {
            console.error(
                'Ошибка записи лога в PostgreSQL:',
                error.message
            );
        }
    });

    next();
};