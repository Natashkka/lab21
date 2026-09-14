'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tests', 'difficulty', {
      type: Sequelize.STRING,
      defaultValue: 'easy'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tests', 'difficulty');
  }
};