
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ServicesProvider } from './context/ServicesContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
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
import { isMockMode, supabase } from './services/supabase';
import { SupabaseApiService } from './services/SupabaseApiService';
import { SupabaseAuthService } from './services/SupabaseAuthService';
import { MockApiService } from './services/MockApiService';
import { MockAuthService } from './services/MockAuthService';

const apiService = isMockMode ? new MockApiService() : new SupabaseApiService(supabase!);
const authService = isMockMode ? new MockAuthService() : new SupabaseAuthService(supabase!);

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      {isMockMode && (
        <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-sm text-center py-2 px-4">
          Demo mode — showing fake data. Set <code className="font-mono bg-yellow-200 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-yellow-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono bg-yellow-200 px-1 rounded">.env.local</code> to connect to a real database.
        </div>
      )}
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
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
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
    <ServicesProvider api={apiService} auth={authService}>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ServicesProvider>
  );
}

export default App;
