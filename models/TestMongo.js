const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema] 
});


const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  status: { type: String, default: 'ready' },
  generatedByAI: { type: Boolean, default: false },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

const TestMongo = mongoose.model('TestMongo', testSchema);

module.exports = TestMongo;