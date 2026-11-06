
import { useState } from 'react';
import { register, login } from '../api';

export default function RegisterForm({
  onRegisterSuccess,
  onSwitchToLogin,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);

      const response = await login(email, password);
      const token = response.data.token;

      if (!token) {
        throw new Error('Сервер не вернул токен авторизации');
      }

      // Сохраняем токен
      localStorage.setItem('token', token);

      // Переходим в приложение
      setSuccess(true);

      setTimeout(() => {
        onRegisterSuccess();
      }, 500);
    } catch (err) {
      const message = (
        err.response?.data?.message || err.message || ''
      ).toLowerCase();

      if (
        message.includes('already') ||
        message.includes('существует') ||
        err.response?.status === 409
      ) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError(
          'Не удалось зарегистрироваться или войти. Попробуйте ещё раз'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-wrapper">
        <div
          className="login-form"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            🎉
          </div>
          <h2>Успешно!</h2>
          <p className="auth-subtitle">
            Аккаунт создан! Входим в систему…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="switch-mode">
          Уже есть аккаунт?{' '}
          <a
            href="#"
            className="link-text"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
          >
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
