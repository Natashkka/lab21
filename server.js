require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./models');
const logger = require('./middleware/logger');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.user = req.query.auth === '1'
        ? { name: 'Администратор', role: 'admin' }
        : { name: 'Гость', role: 'guest' };

    res.locals.user = req.user;
    next();
});

const items = [
    {
        id: 1,
        topic: 'JavaScript',
        question: 'Что вернёт typeof null?',
        options: ['object', 'null', 'undefined', 'number'],
        answer: 0
    },
    {
        id: 2,
        topic: 'HTML',
        question: 'Какой тег создаёт заголовок h1?',
        options: ['<h1>', '<head>', '<title>', '<header>'],
        answer: 0
    },
    {
        id: 3,
        topic: 'SQL',
        question: 'Какая команда выбирает данные?',
        options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        answer: 0
    }
];

let nextId = 4;

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Генератор тестов',
        items
    });
});

app.get('/item/:id', (req, res) => {
    const item = items.find(
        item => item.id === Number(req.params.id)
    );

    if (!item) {
        return res.status(404).render('404', {
            title: 'Тест не найден',
            url: req.originalUrl
        });
    }

    res.render('item', {
        title: item.topic,
        item
    });
});

app.get('/login', (req, res) => {
    res.redirect('/add?auth=1');
});

app.get('/add', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/login');
    }

    res.render('add', {
        title: 'Новый тест'
    });
});

app.post('/add', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/login');
    }

    const {
        topic,
        question,
        opt1,
        opt2,
        opt3,
        opt4,
        answer
    } = req.body;

    items.push({
        id: nextId++,
        topic,
        question,
        options: [opt1, opt2, opt3, opt4].filter(Boolean),
        answer: Number(answer) || 0
    });

    res.redirect('/');
});

app.get('/error', (req, res, next) => {
    next(new Error('Тестовая ошибка сервера'));
});

app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Страница не найдена',
        url: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err.message);

    res.status(500).render('500', {
        title: 'Ошибка сервера',
        error: err.message
    });
});

db.sequelize.authenticate()
    .then(() => {
        console.log('Подключение к PostgreSQL успешно');
        return db.sequelize.sync();
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('Сервер запущен на http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error(
            'Ошибка подключения к PostgreSQL:',
            error.message
        );
    });