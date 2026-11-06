import { useState } from 'react';

const DIFFICULTY_LABELS = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const STATUS_LABELS = {
  ready: 'Готов',
  archived: 'В архиве',
};

export default function TestList({ tests, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftStatus, setDraftStatus] = useState('ready'); 

  const startEdit = (test) => {
    setEditingId(test.id);
    setDraftTitle(test.title);
    
    setDraftStatus(test.status === 'archived' ? 'archived' : 'ready');
  };

  const saveEdit = (id) => {
    const trimmed = draftTitle.trim();
    if (trimmed) {
      
      onEdit(id, trimmed, draftStatus);
    }
    setEditingId(null);
    setDraftTitle('');
  };

  if (tests.length === 0) {
    return <p className="empty">Тестов пока нет. Создайте первый с помощью ИИ.</p>;
  }

  return (
    <ul className="test-list">
      {tests.map((test) => (
        <li key={test.id} className={`test-item status-${test.status || 'ready'}`}>
          {editingId === test.id ? (
            /* РЕЖИМ РЕДАКТИРОВАНИЯ */
            <div className="edit-row">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(test.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
              />
              
              {/* Выпадающий список для статуса */}
              <select 
                value={draftStatus} 
                onChange={(e) => setDraftStatus(e.target.value)}
                className="edit-select"
              >
                <option value="ready">Готов</option>
                <option value="archived">В архиве</option>
              </select>

              <button className="btn-save" onClick={() => saveEdit(test.id)}>Сохранить</button>
              <button className="btn-cancel" onClick={() => setEditingId(null)}>Отмена</button>
            </div>
          ) : (
            /* РЕЖИМ ПРОСМОТРА */
            <>
              <div className="test-info">
                <b onDoubleClick={() => startEdit(test)}>{test.title}</b>
                <span className="meta">
                  {test.topic} • {DIFFICULTY_LABELS[test.difficulty] || test.difficulty} •{' '}
                  {test.questions?.length || 0} вопр. •{' '}
                  {new Date(test.createdAt).toLocaleDateString()} •{' '}
                  <span style={{ fontWeight: 600 }}>{STATUS_LABELS[test.status || 'ready']}</span>
                </span>
              </div>

              <div className="test-actions">
                <button className="btn-edit" onClick={() => startEdit(test)}>Изменить</button>
                <button className="btn-delete" onClick={() => onDelete(test.id)}>Удалить</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}