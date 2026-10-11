import { useState } from 'react';

export default function TestForm({ onAdd, isGenerating }) {
  // useState: значения полей формы
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionsCount, setQuestionsCount] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;

    // Передаём данные родителю (App) — там они попадут в массив тестов
    onAdd({
      topic: trimmed,
      difficulty,
      questionsCount: Number(questionsCount) || 5,
    });

    // Сброс формы
    setTopic('');
    setDifficulty('medium');
    setQuestionsCount(5);
  };

  return (
    <form className="test-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Тема теста (например, React Hooks)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={isGenerating}
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        disabled={isGenerating}
      >
        <option value="easy">Лёгкий</option>
        <option value="medium">Средний</option>
        <option value="hard">Сложный</option>
      </select>

      <input
        type="number"
        min="1"
        max="30"
        value={questionsCount}
        onChange={(e) => setQuestionsCount(e.target.value)}
        disabled={isGenerating}
      />

      <button type="submit" disabled={isGenerating}>
        {isGenerating ? 'ИИ генерирует…' : 'Сгенерировать тест'}
      </button>
    </form>
  );
}