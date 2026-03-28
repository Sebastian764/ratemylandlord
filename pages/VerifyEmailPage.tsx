import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage: React.FC = () => {
  const { verifyOtp } = useAuth();
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

    const queryParams = new URLSearchParams(globalThis.location.search);
    const tokenHash = queryParams.get('token_hash');
    const rawType = queryParams.get('type');

    if (!tokenHash) {
      handleError('Invalid verification link. Please request a new one by registering again.');
      return;
    }

    const verifyWithTokenHash = async () => {
      try {
        const allowedTypes = ['signup', 'invite', 'email', 'email_change'] as const;
        const explicitType = (allowedTypes as readonly string[]).includes(rawType ?? '')
          ? (rawType as (typeof allowedTypes)[number])
          : null;

        const candidateTypes: Array<(typeof allowedTypes)[number]> = explicitType
          ? [explicitType]
          : ['signup', 'email'];

        let lastErrorMessage = 'Email verification failed.';

        for (const otpType of candidateTypes) {
          const { error } = await verifyOtp({ tokenHash, type: otpType });

          if (!error) {
            handleSuccess();
            return;
          }

          lastErrorMessage = error || lastErrorMessage;

          // If token is expired/used, no point trying more types.
          if (lastErrorMessage.toLowerCase().includes('expired') || lastErrorMessage.toLowerCase().includes('already')) {
            break;
          }
        }

        if (lastErrorMessage.toLowerCase().includes('expired')) {
          handleError('The verification link has expired. Please request a new one by registering again.');
          return;
        }

        if (lastErrorMessage.toLowerCase().includes('already')) {
          handleError('This verification link was already used. Try logging in, or request another verification email.');
          return;
        }

        handleError(`Email verification failed: ${lastErrorMessage}`);
      } catch (error) {
        console.error('Error verifying email token:', error);
        handleError('An error occurred while verifying your email. Please try again later.');
      }
    };

    void verifyWithTokenHash();
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
