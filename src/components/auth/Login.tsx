import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuthStore();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TaskBoard Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Advanced Task Collaboration with Workflow Automation
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            ) : (
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 8.12l-7.58 3.79c-.37.18-.8-.04-.8-.46V8.38c0-.42.43-.64.8-.46l7.58 3.79c.37.18.37.7 0 .88z" />
                </svg>
              </span>
            )}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;