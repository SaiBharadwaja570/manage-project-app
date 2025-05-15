// src/utils/auth.js

// Get token from localStorage
export const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  };
  
  // Get current user from localStorage
  export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };
  
  // Save user to localStorage
  export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  // Remove user from localStorage (logout)
  export const logout = () => {
    localStorage.removeItem('user');
  };
  