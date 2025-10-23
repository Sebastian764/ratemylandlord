
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import LandlordPage from './pages/LandlordPage';
import AddLandlordPage from './pages/AddLandlordPage';
import AddReviewPage from './pages/AddReviewPage';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  return (
    <AdminProvider>
      <DataProvider>
        <HashRouter>
          <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/landlord/:id" element={<LandlordPage />} />
                <Route path="/landlord/:id/add-review" element={<AddReviewPage />} />
                <Route path="/add-landlord" element={<AddLandlordPage />} />
                <Route path="/admin" element={<AdminLoginPage />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </DataProvider>
    </AdminProvider>
  );
}

export default App;
