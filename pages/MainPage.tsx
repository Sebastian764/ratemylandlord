
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import LandlordCard from '../components/LandlordCard';
import type { Landlord } from '../types';

const MainPage: React.FC = () => {
  const { landlords, loading } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const contentRef = React.useRef<HTMLDivElement>(null);

  const filteredLandlords = useMemo(() => {
    if (!searchTerm) {
      return landlords;
    }
    return landlords.filter(landlord =>
      landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, landlords]);

  const handleAddLandlordClick = () => {
    if (user) {
      navigate('/add-landlord');
    } else {
      navigate('/login');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a,#1e293b)] opacity-100"></div>
        <div className="absolute inset-0 bg-[url('/assets/carbon-fibre.png')] opacity-10"></div>

        <div className="container mx-auto text-center relative z-10">

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight animate-fade-in text-white leading-tight">
            Rent with Confidence in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Steel City</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto animate-slide-up font-light leading-relaxed">
            Search for landlords in Pittsburgh and read reviews from previous tenants.
          </p>
          <div className="max-w-3xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-2 transition-all focus-within:bg-white/10 focus-within:border-amber-400/30 focus-within:scale-[1.01] duration-300">
              <div className="pl-6 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by landlord, address, or neighborhood..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 text-lg text-white placeholder-slate-400 bg-transparent border-none focus:ring-0 outline-none"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium animate-fade-in text-slate-400" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                <span>Verified Student Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                <span>Anonymous & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.5)]"></span>
                <span>Community Driven</span>
              </div>
            </div>

            <div className="mt-6">
              <span className="font-light text-slate-400">Can't find your landlord? </span>
              <Link to="/add-landlord" className="group inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
                <span className="font-bold">Add them now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div ref={contentRef} className="container mx-auto px-4 py-16">
        {/* <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Rated Landlords</h2>
            <p className="text-gray-600 mt-2">Based on reviews from the community</p>
          </div>
          <div className="hidden md:block text-sm text-gray-500">
            Showing {filteredLandlords.length} results
          </div>
        </div> */}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLandlords.length > 0 ? (
              filteredLandlords.map((landlord: Landlord) => (
                <LandlordCard key={landlord.id} landlord={landlord} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No landlords found</h3>
                <p className="text-gray-600 mb-6">We couldn't find any landlords matching "{searchTerm}"</p>
                <button
                  onClick={handleAddLandlordClick}
                  className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Add a New Landlord
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
