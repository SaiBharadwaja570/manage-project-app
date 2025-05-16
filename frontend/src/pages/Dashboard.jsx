// src/pages/Dashboard.jsx
import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Welcome, {user.displayName || user.email}!</h1>
      <p>Your dashboard content here.</p>
    </div>
  );
}
