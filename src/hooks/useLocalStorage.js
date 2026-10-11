import { useState, useEffect } from 'react';

/**
 * Синхронизирует состояние React с localStorage.
 * @param {string} key - ключ в localStorage
 * @param {any} initialValue - значение по умолчанию (или функция-инициализатор)
 */
export function useLocalStorage(key, initialValue) {
  // Ленивая инициализация: читаем из localStorage только при первом рендере
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) {
      console.warn('Ошибка чтения localStorage:', e);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // Автосохранение при каждом изменении value
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Ошибка записи localStorage:', e);
    }
  }, [key, value]);

  return [value, setValue];
}