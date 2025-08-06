import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup(email, password, name, role);
      navigate('/');
    } catch (error: any) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-gray-200 rounded-xl shadow-md p-8 space-y-6">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-full font-bold text-sm">VR</div>
          <span className="font-semibold text-lg">VitalRoute</span>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-1 text-sm text-gray-500">Please enter your details</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <User className="h-4 w-4 text-gray-400 absolute top-2.5 left-3" />
          </div>

          {/* Email */}
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

          {/* Role Selection */}
          <div className="relative">
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black appearance-none ${role === '' ? 'text-gray-400' : 'text-gray-700'}`}
            >
              <option value="" disabled>Select your role</option>
              <option value="ambulance_driver">Ambulance Driver</option>
              <option value="fire_driver">Fire Engine Driver</option>
              <option value="admin">Admin</option>
            </select>
            <Shield className="h-4 w-4 text-gray-400 absolute top-2.5 left-3 pointer-events-none" />
            <svg
              className="h-4 w-4 text-gray-400 absolute top-3 right-3 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <Lock className="h-4 w-4 text-gray-400 absolute top-2.5 left-3" />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
