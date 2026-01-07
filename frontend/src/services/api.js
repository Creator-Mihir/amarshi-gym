import axios from 'axios';

// Switch automatically based on where the app is running
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api' 
  : 'https://amarshi-gym-backend.onrender.com'; // <--- PASTE RENDER URL HERE

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('memberToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;