// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // change to your backend URL

const getToken = () => localStorage.getItem('backendToken');

export const loginBackend = async (firebaseIdToken) => {
  const res = await axios.post(`${API_BASE}/auth/login`, null, {
    headers: { Authorization: `Bearer ${firebaseIdToken}` }
  });
  return res.data; // expected backend token and user info
};

export const getUserInfo = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch {
    return null;
  }
};
