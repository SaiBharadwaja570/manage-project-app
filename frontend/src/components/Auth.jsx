// src/components/Auth.js
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendTokenToBackend = async (user) => {
    const token = await user.getIdToken();

    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await sendTokenToBackend(result.user);
    } catch (err) {
      console.error('Google login error:', err);
      alert('Google sign-in failed');
    }
  };

  const handleEmailSubmit = async () => {
    try {
      let userCredential;

      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(userCredential.user, { displayName: form.name });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      }

      await sendTokenToBackend(userCredential.user);
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto shadow-lg mt-20 rounded-lg bg-white">
      <h1 className="text-3xl font-bold text-center">
        {isRegistering ? 'Register' : 'Login'} to TaskBoard Pro
      </h1>

      {isRegistering && (
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />
      )}
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border px-4 py-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border px-4 py-2 rounded"
      />

      <button
        onClick={handleEmailSubmit}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isRegistering ? 'Register' : 'Login'} with Email
      </button>

      <div className="text-center text-sm text-gray-500">
        or
      </div>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Sign in with Google
      </button>

      <p className="text-sm text-center mt-2">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <button
          className="ml-1 text-blue-600 underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
