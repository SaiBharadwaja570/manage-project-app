// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) return null; // Optional: show a loading spinner

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
