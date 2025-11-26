import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TurnstileWidget from '../components/TurnstileWidget';
import { TurnstileInstance } from '@marsidev/react-turnstile';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileInstance>(null);
  const { login, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailNotVerified(false);
    setResendMessage('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password.');
      if (result.emailNotVerified) {
        setEmailNotVerified(true);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage('Please enter your email address.');
      return;
    }

    try {
      // Import supabase to resend verification
      const { supabase } = await import('../services/supabase');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${globalThis.location.origin}/verify-email`,
        },
      });

      if (error) {
        setResendMessage('Failed to resend verification email. Please try again.');
      } else {
        setResendMessage('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
      setResendMessage('Failed to resend verification email. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!turnstileToken) {
      setResetError('Please complete the security verification.');
      return;
    }

    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }

    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetMessage('Password reset email sent! Please check your inbox.');
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail('');
        setResetMessage('');
        setTurnstileToken('');
      }, 3000);
    } else {
      setResetError(result.error || 'Failed to send reset email.');
      // Reset turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>
          {error && (
            <div className="space-y-2">
              <p className="text-red-500 text-sm">{error}</p>
              {emailNotVerified && (
                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold text-left"
                  >
                    Resend Verification Email
                  </button>
                  {resendMessage && (
                    <p className={`text-sm ${resendMessage.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-800">
            Sign up now
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          <button
            onClick={() => setShowResetModal(true)}
            className="text-slate-900 hover:text-slate-700 font-semibold"
          >
            Forgot password?
          </button>
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetError('');
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <TurnstileWidget
                turnstileRef={turnstileRef}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken('')}
                onError={() => setTurnstileToken('')}
              />
              {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
              {resetMessage && <p className="text-green-600 text-sm">{resetMessage}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                    setResetError('');
                    setResetMessage('');
                    setTurnstileToken('');
                    turnstileRef.current?.reset();
                  }}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!turnstileToken}
                  className="flex-1 py-2 px-4 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 disabled:opacity-50"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
