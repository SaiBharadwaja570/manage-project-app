import axios from 'axios';
import { auth } from '../firebase';

// Create a configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  // Get Firebase token
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add any other headers here
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data, // Directly return the data
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;