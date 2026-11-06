import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password) => api.post('/auth/register', { email, password });
export const getProfile = () => api.get('/auth/profile');

export const fetchTests = () => api.get('/tests');
export const fetchTestById = (id) => api.get(`/tests/${id}`);
export const addTest = (test) => api.post('/tests', test);
export const updateTest = (id, updated) => api.put(`/tests/${id}`, updated);
export const deleteTest = (id) => api.delete(`/tests/${id}`);

export const generateTest = ({ topic, questionCount, difficulty }) =>
  api.post('/generate', { topic, questionCount, difficulty });