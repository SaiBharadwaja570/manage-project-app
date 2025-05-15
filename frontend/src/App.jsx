// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView';
import Tasks from './pages/Tasks';
import Automations from './pages/Automations';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectView />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/automations" element={<Automations />} />
        </Route>

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
