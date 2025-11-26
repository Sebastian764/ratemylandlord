import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Check if this is an email verification callback
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');

      if (type === 'signup' && accessToken) {
        // Email verification successful
        setStatus('success');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      } else if (!type && !accessToken) {
        // No verification parameters, might be a direct visit
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Already logged in, redirect to home
            navigate('/', { replace: true });
          } else {
            setStatus('error');
            setErrorMessage('Invalid verification link. Please try registering again.');
          }
        } catch (error) {
          console.error('Error checking session:', error);
          setStatus('error');
          setErrorMessage('An error occurred while checking your session. Please try again later.');
        }
      } else {
        // Handle unexpected type values or malformed links
        setStatus('error');
        setErrorMessage('This link is not for email verification. If you need to verify your email, please check your inbox for the correct link.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verified!</h1>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
