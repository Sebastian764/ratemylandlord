import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  const handleSuccess = useCallback(() => {
    setStatus('success');
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);
  }, [navigate]);

  const handleError = useCallback((message: string) => {
    setStatus('error');
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check for error parameters in the URL (from Supabase redirects)
    const hashParams = new URLSearchParams(globalThis.location.hash.substring(1));
    const urlError = hashParams.get('error');
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');

    if (urlError || errorCode) {
      // Handle Supabase error redirects
      let message = 'Email verification failed.';
      if (errorCode === 'otp_expired') {
        message = 'The verification link has expired. Please request a new one by registering again.';
      } else if (errorDescription) {
        message = decodeURIComponent(errorDescription.replaceAll('+', ' '));
      }
      handleError(message);
      return;
    }

    // Listen for auth state changes - this catches the verification event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Email verification was successful, user is now signed in
        handleSuccess();
      }
    });

    // Also check current session in case we already processed the tokens
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User has a valid session - verification was successful
          handleSuccess();
        } else {
          // No session - wait a moment for the auth state change to fire
          // The tokens might still be processing
          setTimeout(async () => {
            const { data: { session: delayedSession } } = await supabase.auth.getSession();
            if (delayedSession) {
              handleSuccess();
            } else {
              // Still no session after delay, show error
              handleError('Unable to verify your email. The link may have expired or already been used. Please try registering again.');
            }
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        handleError('An error occurred while verifying your email. Please try again later.');
      }
    };

    void checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [handleSuccess, handleError]);

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
