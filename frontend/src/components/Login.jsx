// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { saveUserToLocalStorage } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      saveUserToLocalStorage(data.user);
      navigate('/dashboard');
    } catch (err) {
      alert('Google Sign-In Failed');
      console.error(err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      saveUserToLocalStorage(data.user);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
            Login with Email
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-lg"
        >
          Sign in with Google
        </button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
