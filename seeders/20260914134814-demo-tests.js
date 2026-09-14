'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tests', [
      {
        title: 'Основы JavaScript',
        topic: 'JavaScript',
        questions: JSON.stringify([
          {
            question: 'Что такое замыкание?',
            options: ['Функция внутри функции', 'Объект с методами', 'Массив функций'],
            correctAnswer: 0
          }
        ]),
        generatedByAI: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Основы Node.js',
        topic: 'Node.js',
        questions: JSON.stringify([
          {
            question: 'Что такое Event Loop?',
            options: ['Цикл событий', 'База данных', 'Фреймворк'],
            correctAnswer: 0
          }
        ]),
        generatedByAI: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tests', null, {});
  }
};