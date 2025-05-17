// pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { currentUser, login, signup, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle(); // now redirects
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/'); // or '/dashboard' if you prefer
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? isSignup ? 'Signing up...' : 'Logging in...'
              : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup
              ? 'Already have an account? Login'
              : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
