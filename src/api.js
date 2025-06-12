import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://idbackend-rf1u.onrender.com',
});

export default api;
