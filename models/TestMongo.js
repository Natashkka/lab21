const mongoose = require('mongoose');

// Вложенная схема вариантов ответа
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

// Вложенная схема вопросов
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema] 
});

// Основная схема (документ)
const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  status: { type: String, default: 'ready' },
  generatedByAI: { type: Boolean, default: false },
  questions: [questionSchema], // <--- Вот наш массив вложенных документов!
  createdAt: { type: Date, default: Date.now }
});

const TestMongo = mongoose.model('TestMongo', testSchema);

module.exports = TestMongo;