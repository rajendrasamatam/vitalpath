import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = (err: unknown, defaultMessage: string) => {
    setLoading(false);
    if (err instanceof FirebaseError) {
      // Provide more specific feedback for common Firebase errors
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        case 'auth/popup-closed-by-user':
          // Silently handle this, as it's not a real error
          break;
        default:
          console.error(err.message);
          setError(defaultMessage);
      }
    } else {
      console.error(err);
      setError(defaultMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      handleAuthError(error, 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      handleAuthError(error, 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      handleAuthError(error, 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-gray-200 rounded-xl shadow-md p-8 space-y-6">
        {/* Logo + Brand Name */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-full font-bold text-sm">VR</div>
          <span className="font-semibold text-lg">VitalRoute</span>
        </div>

        {/* Welcome Text */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Please enter your details</p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5 mr-2"
          />
          Sign in with Google
        </button>

        {/* OR separator */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}
          {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">{message}</div>}

          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <Mail className="h-4 w-4 text-gray-400 absolute top-2.5 left-3" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <Lock className="h-4 w-4 text-gray-400 absolute top-2.5 left-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Remember for 30 days</span>
            </label>
            <button
              type="button"
              className="text-black font-medium hover:underline"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot password
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>

        {/* Sign up link */}
        <div className="text-center text-sm">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-semibold text-black hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};