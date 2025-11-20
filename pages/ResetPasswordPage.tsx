import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidRecovery, setIsValidRecovery] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via password recovery link
    const checkRecoverySession = async () => {
      try {
        
        // Check if we still have tokens in the URL hash (App.tsx is processing them)
        const hashParams = new URLSearchParams(globalThis.location.hash.substring(1));
        const hasTokensInUrl = hashParams.has('access_token') && hashParams.get('type') === 'recovery';

        // TODO: Add a retry limit to avoid potential infinite loops
        if (hasTokensInUrl) {
          // App.tsx is still processing, wait a bit
          setTimeout(() => {
            void checkRecoverySession();
          }, 100);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setError('Invalid or expired password reset link. Please request a new one.');
          setCheckingRecovery(false);
          return;
        }

        // Verify this is a valid recovery session
        // Check the sessionStorage flag set by App.tsx when processing recovery tokens
        const recoveryFlag = sessionStorage.getItem('password_recovery');
        
        // The presence of the recovery flag indicates we came from a valid recovery link
        // This flag is set in App.tsx after successfully processing the recovery tokens
        const isRecoverySession = recoveryFlag === 'true';
        
        if (isRecoverySession) {
          setIsValidRecovery(true);
        } else {
          setError('Invalid or expired password reset link. Please request a new one.');
        }
      } catch (err) {
        setError('Unable to verify password reset link.');
      } finally {
        setCheckingRecovery(false);
      }
    };

    void checkRecoverySession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isValidRecovery) {
      setError('Invalid password reset session.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      // Clear the recovery flag
      sessionStorage.removeItem('password_recovery');
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        // Sign out to ensure the recovery session is fully cleared
        void supabase.auth.signOut();
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error || 'Failed to update password.');
    }
  };

  if (checkingRecovery) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidRecovery) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Invalid Link</h1>
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 mb-6">
            {error || 'This password reset link is invalid or has expired.'}
          </div>
          <p className="text-center text-gray-600 mb-6">
            Please request a new password reset link from the login page.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Set New Password</h1>
        <p className="text-center text-gray-500 mb-8">Enter your new password below.</p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
