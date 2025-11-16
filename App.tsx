
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import MainPage from './pages/MainPage';
import LandlordPage from './pages/LandlordPage';
import AddLandlordPage from './pages/AddLandlordPage';
import AddReviewPage from './pages/AddReviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/landlord/:id" element={<LandlordPage />} />
                <Route path="/landlord/:id/add-review" element={<AddReviewPage />} />
                <Route path="/add-landlord" element={<AddLandlordPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
