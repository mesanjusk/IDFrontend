import axios from 'axios';

// Configure axios globally so any module importing this file gets the base URL.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ||
  'https://idbackend-rf1u.onrender.com';

export default axios;
