
import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { supabase } from './services/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import MainPage from './pages/MainPage';
import LandlordPage from './pages/LandlordPage';
import AddLandlordPage from './pages/AddLandlordPage';
import AddReviewPage from './pages/AddReviewPage';
import EditReviewPage from './pages/EditReviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ResourcesPage from './pages/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Handle auth tokens from URL hash (recovery and signup verification)
    const handleAuthTokens = async () => {
      // Prevent multiple simultaneous executions
      if (isProcessingRef.current) return;

      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Handle email verification for new signups
      // Don't navigate away - let Supabase process the tokens first, then navigate
      if (type === 'signup' && accessToken) {
        isProcessingRef.current = true;
        try {
          // Let Supabase process the tokens from the URL automatically
          // This sets up the session before we navigate
          await supabase.auth.getSession();
          // Small delay to ensure session is established
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error processing signup tokens:', error);
        }
        navigate('/verify-email', { replace: true });
        isProcessingRef.current = false;
        return;
      }

      // Only process recovery tokens once
      if (type === 'recovery' && accessToken && refreshToken) {
        isProcessingRef.current = true;
        try {
          // Set the session with recovery tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting recovery session:', error);
            isProcessingRef.current = false;
            return;
          }
          
          // Mark this as a valid recovery session before navigating
          sessionStorage.setItem('password_recovery', 'true');
          
          // Wait for session to be fully established before navigating
          // This prevents race conditions where ResetPasswordPage checks before session is ready
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Verify session was established
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.error('Session not established after setSession');
            isProcessingRef.current = false;
            return;
          }
          
          // Navigate to reset password page - React Router will handle the history
          navigate('/reset-password', { replace: true });
        } catch (error) {
          console.error('Error setting recovery session:', error);
        } finally {
          isProcessingRef.current = false;
        }
      }
    };

    void handleAuthTokens();
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/landlord/:id" element={<LandlordPage />} />
          <Route path="/landlord/:id/add-review" element={<AddReviewPage />} />
          <Route path="/landlord/:id/review/:reviewId/edit" element={<EditReviewPage />} />
          <Route path="/add-landlord" element={<AddLandlordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
