'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    static associate(models) {
      // define association here
    }
  }
  Test.init({
    title: DataTypes.STRING,
    topic: DataTypes.STRING,
    questions: DataTypes.JSONB,
    generatedByAI: DataTypes.BOOLEAN,
    difficulty: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ready' // По умолчанию тест создается как "Готов"
    }
  }, {
    sequelize,
    modelName: 'Test',
  });
  return Test;
};