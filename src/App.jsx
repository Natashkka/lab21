import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import TestForm from './components/TestForm';
import TestList from './components/TestList';
import TestFilters from './components/TestFilters';
import Stats from './components/Stats';
import './App.css';

// Начальные данные, если localStorage пуст
const DEFAULT_TESTS = [
  {
    id: 1,
    topic: 'Основы React',
    difficulty: 'easy',
    questionsCount: 5,
    status: 'ready',
    createdAt: Date.now() - 86400000 * 3, // 3 дня назад
  },
  {
    id: 2,
    topic: 'React Hooks',
    difficulty: 'medium',
    questionsCount: 10,
    status: 'draft',
    createdAt: Date.now() - 86400000, // 1 день назад
  },
];

export default function App() {
  const [tests, setTests] = useLocalStorage('ai_tests', DEFAULT_TESTS);

  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = `ИИ-генератор тестов (${tests.length})`;
  }, [tests.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('[autosave] сохранено тестов:', tests.length);
    }, 500);
    return () => clearTimeout(timer); // отменяем предыдущий таймер
  }, [tests]);


  const addTest = ({ topic, difficulty, questionsCount }) => {
    setIsGenerating(true);
    setTimeout(() => {
      setTests((prev) => [
        {
          id: Date.now(),
          topic,
          difficulty,
          questionsCount,
          status: 'draft',
          createdAt: Date.now(),
        },
        ...prev,
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const deleteTest = (id) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  const editTest = (id, topic) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, topic } : t)));
  };

  const changeStatus = (id, status) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  // ---- Фильтрация + сортировка (useMemo — оптимизация) ----
  const visibleTests = useMemo(() => {
    let result = [...tests];

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (difficultyFilter !== 'all') {
      result = result.filter((t) => t.difficulty === difficultyFilter);
    }

    switch (sort) {
      case 'date-desc':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'date-asc':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'topic-asc':
        result.sort((a, b) => a.topic.localeCompare(b.topic));
        break;
      case 'topic-desc':
        result.sort((a, b) => b.topic.localeCompare(a.topic));
        break;
      case 'questions-desc':
        result.sort((a, b) => b.questionsCount - a.questionsCount);
        break;
      case 'questions-asc':
        result.sort((a, b) => a.questionsCount - b.questionsCount);
        break;
      default:
        break;
    }

    return result;
  }, [tests, statusFilter, difficultyFilter, sort]);

  return (
    <div className="app">
      <h1>🤖 ИИ-генератор тестов</h1>

      <Stats tests={tests} />

      <TestForm onAdd={addTest} isGenerating={isGenerating} />

      <TestFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
        sort={sort}
        onSortChange={setSort}
      />

      <TestList
        tests={visibleTests}
        onDelete={deleteTest}
        onEdit={editTest}
        onStatusChange={changeStatus}
      />
    </div>
  );
}