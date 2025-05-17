import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './services/ErrorBoundry';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Automation from './pages/Automation';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/automation" element={<Automation />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
