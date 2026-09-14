// models/tests.model.js
// Пока данные хранятся в памяти (массив).
// В следующих лабораторных здесь будет подключение к БД.

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

module.exports = {
    getAll: () => tests,
    getById: (id) => tests.find(t => t.id === id),
    create: (data) => {
        const newTest = {
            id: nextId++,
            ...data,
            createdAt: new Date().toISOString()
        };
        tests.push(newTest);
        return newTest;
    },
    update: (id, data) => {
        const index = tests.findIndex(t => t.id === id);
        if (index === -1) return null;
        tests[index] = {
            ...tests[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        return tests[index];
    },
    remove: (id) => {
        const index = tests.findIndex(t => t.id === id);
        if (index === -1) return null;
        const deleted = tests.splice(index, 1);
        return deleted[0];
    }
};