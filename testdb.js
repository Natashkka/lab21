require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.connect()
    .then(() => {
        console.log('✅ Подключение к БД работает');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('📅 Время сервера:', res.rows[0].now);
        client.end();
    })
    .catch(err => {
        console.error('❌ Ошибка подключения:', err.message);
    });