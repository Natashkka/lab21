import { useState, useEffect, useMemo, useCallback } from 'react';
import LoginForm from './components/LoginForm';
import TestForm from './components/TestForm';
import TestList from './components/TestList';
import TestFilters from './components/TestFilters';
import Stats from './components/Stats';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import { fetchTests, deleteTest as apiDeleteTest, generateTest as apiGenerateTest } from './api';
import './App.css';


async function fetchWithRetry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const [authMode, setAuthMode] = useState('login');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');

 
  const loadTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithRetry(() => fetchTests());
      setTests(response.data.data || []);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err.response?.data?.message || 'Не удалось загрузить тесты');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadTests();
  }, [token, loadTests]);

  useEffect(() => {
    document.title = `ИИ-генератор тестов (${tests.length})`;
  }, [tests.length]);


    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); 
    setToken(null);
    setTests([]);
  };

const addTest = async ({ topic, difficulty, questionsCount }) => {
  const tempId = `temp-${Date.now()}`;
  const optimisticTest = {
    id: tempId,
    title: `Тест: ${topic}`,          
    topic: topic,
    difficulty: difficulty,
    questions: [],                     
    generatedByAI: true,
    createdAt: new Date().toISOString(),
    status: 'ready',
    __optimistic: true,              
  };

  
  setTests((prev) => [optimisticTest, ...prev]);
  setIsGenerating(true);

  try {
    const response = await apiGenerateTest({
  topic,
  questionCount: Number(questionsCount) || 3,
  difficulty,
});

    const realTest = response.data.data;

    setTests((prev) =>
      prev.map((t) => (t.id === tempId ? realTest : t))
    );
  } catch (err) {
    setTests((prev) => prev.filter((t) => t.id !== tempId));
    alert('Не удалось создать тест: ' + (err.response?.data?.message || err.message));
  } finally {
    setIsGenerating(false);
  }
};


  const deleteTest = async (id) => {
    const backup = tests;
    setTests((prev) => prev.filter((t) => t.id !== id));

    try {
      await apiDeleteTest(id);
    } catch (err) {
      alert('Не удалось удалить: ' + (err.response?.data?.message || err.message));
      setTests(backup);
    }
  };


    const editTest = async (id, newTitle, newStatus) => {
    const backup = tests;
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, title: newTitle, status: newStatus } : t)));

    try {
      const current = tests.find((t) => t.id === id);
      const { updateTest } = await import('./api');
      await updateTest(id, {
        title: newTitle,
        topic: current.topic,
        questions: current.questions,
        status: newStatus, 
      });
    } catch (err) {
      alert('Не удалось изменить: ' + (err.response?.data?.message || err.message));
      setTests(backup);
    }
  };

const visibleTests = useMemo(() => {
  let result = [...tests];

  if (statusFilter !== 'all') {
  result = result.filter(
    (test) => (test.status || 'ready') === statusFilter
  );
}


  if (difficultyFilter !== 'all') {
    result = result.filter(
      (t) => t.difficulty === difficultyFilter
    );
  }

    switch (sort) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'topic-asc':
        result.sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
        break;
      case 'topic-desc':
        result.sort((a, b) => (b.topic || '').localeCompare(a.topic || ''));
        break;
      case 'questions-desc':
        result.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
        break;
      case 'questions-asc':
        result.sort((a, b) => (a.questions?.length || 0) - (b.questions?.length || 0));
        break;
      default:
        break;
    }

    return result;
 }, [tests, statusFilter, difficultyFilter, sort]);


if (!token) {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <h1 className="auth-title">
          {authMode === 'login' ? 'Вход в систему' : 'Регистрация'}
        </h1>
        {authMode === 'login' ? (
          <LoginForm
            onLoginSuccess={(newToken) => setToken(newToken)}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={() => {
              const savedToken = localStorage.getItem('token');
              if (savedToken) {
                setToken(savedToken);
              }
            }}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  );
}


  if (loading) {
    return (
      <div className="app">
        <h2>ИИ-генератор тестов</h2>
        <p className="loading">Загрузка данных с сервера…</p>
      </div>
    );
  }

  if (error) {
  return (
    <div className="app">
      <h2>ИИ-генератор тестов</h2>
      <p className="error">{error}</p>
      <div className="retry-container">
        <button className="retry-btn" onClick={loadTests}>
          Повторить
        </button>
      </div>
    </div>
  );
}

          return (
    <>
      {/* 1. ШАПКА */}
      <div className="app-header">
        <div className="header-brand">
          <span className="brand-logo"></span> ИИ-генератор
        </div>
        <div className="header-user">
          <div className="header-avatar">
            {(localStorage.getItem('userEmail') || 'U')[0].toUpperCase()}
          </div>
          <span className="header-email">
            {localStorage.getItem('userEmail') || 'test@example.com'}
          </span>
          <button className="logout-btn" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      {/* 2. ОСНОВНОЙ КОНТЕНТ (в контейнере .app) */}
      <div className="app">
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
          onStatusChange={() => {}}
        />
        <div>
          <Chat />
        </div>
      </div>

      {/* 3. ФУТЕР (вне контейнера .app) */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <h3>ИИ-генератор тестов</h3>
            <p>Быстрое создание проверочных тестов по любой теме.</p>
          </div>
          <div className="footer-contacts">
            <h4>Контакты</h4>
            <p>📞 +375 (29) 123-45-67</p>
            <p>✉️ support@aitests.by</p>
          </div>
          <div className="footer-socials">
            <h4>Мы в соцсетях</h4>
            <div className="social-links">
              <a href="#">Telegram</a>
              <a href="#">VK</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ИИ-генератор тестов</span>
          <span>Все права защищены</span>
        </div>
      </footer>
    </>
  );
}