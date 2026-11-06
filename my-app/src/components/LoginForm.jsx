import { useState } from 'react';
import { login } from '../api';

export default function LoginForm({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
const { token } = response.data;

localStorage.setItem('token', token);

localStorage.setItem('userEmail', email); 

onLoginSuccess(token);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Не удалось войти. Проверьте email и пароль.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="switch-mode">
  Нет аккаунта?{' '}
  <a
    href="#"
    className="link-text"
    onClick={(e) => {
      e.preventDefault();
      onSwitchToRegister(); 
    }}
  >
    Зарегистрироваться
  </a>
</p>
    </div>
  );
}