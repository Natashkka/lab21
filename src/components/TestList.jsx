import { useState } from 'react';

const DIFFICULTY_LABELS = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const STATUS_LABELS = {
  draft: 'Черновик',
  ready: 'Готов',
  archived: 'В архиве',
};

export default function TestList({ tests, onDelete, onEdit, onStatusChange }) {
  // useState: id теста, который сейчас редактируется, и черновик темы
  const [editingId, setEditingId] = useState(null);
  const [draftTopic, setDraftTopic] = useState('');

  const startEdit = (test) => {
    setEditingId(test.id);
    setDraftTopic(test.topic);
  };

  const saveEdit = (id) => {
    const trimmed = draftTopic.trim();
    if (trimmed) onEdit(id, trimmed);
    setEditingId(null);
    setDraftTopic('');
  };

  // Пустой список — показываем сообщение
  if (tests.length === 0) {
    return <p className="empty">Тестов пока нет. Создайте первый с помощью ИИ.</p>;
  }

  return (
    <ul className="test-list">
      {tests.map((test) => (
        <li key={test.id} className={`test-item status-${test.status}`}>
          {editingId === test.id ? (
            <>
              {/* Режим редактирования темы */}
              <input
                type="text"
                value={draftTopic}
                onChange={(e) => setDraftTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(test.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
              />
              <button onClick={() => saveEdit(test.id)}>Сохранить</button>
              <button onClick={() => setEditingId(null)}>Отмена</button>
            </>
          ) : (
            <>
              {/* Обычный просмотр */}
              <div className="test-info">
                <b onDoubleClick={() => startEdit(test)}>{test.topic}</b>
                <span className="meta">
                  {DIFFICULTY_LABELS[test.difficulty]} • {test.questionsCount} вопр. •{' '}
                  {new Date(test.createdAt).toLocaleDateString()}
                </span>
              </div>

              <select
                value={test.status}
                onChange={(e) => onStatusChange(test.id, e.target.value)}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>

              <button onClick={() => startEdit(test)} title="Редактировать">✎</button>
              <button onClick={() => onDelete(test.id)} title="Удалить">✕</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}