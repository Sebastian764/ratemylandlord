
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import LandlordCard from '../components/LandlordCard';
import CityAutocomplete from '../components/CityAutocomplete';
import type { Landlord } from '../types';
import { getLandlordCities, landlordHasCity } from '../utils/landlord';

const MainPage: React.FC = () => {
  const { landlords, cities, loading } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const filteredLandlords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return landlords.filter(landlord => {
      const matchesTerm =
        !term ||
        landlord.name.toLowerCase().includes(term) ||
        (landlord.addresses ?? []).some(addr => addr.toLowerCase().includes(term)) ||
        getLandlordCities(landlord).some(city => city.toLowerCase().includes(term));

      const matchesCity = !cityFilter || landlordHasCity(landlord, cityFilter);

      return matchesTerm && matchesCity;
    });
  }, [searchTerm, cityFilter, landlords]);

  const handleAddLandlordClick = () => {
    if (user) {
      navigate('/add-landlord');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in">
            Find Your Landlord
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto animate-slide-up">
            Search for landlords by name or city and read reviews from previous tenants.
          </p>

          <div className="max-w-3xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-3xl md:rounded-full shadow-2xl p-2 gap-2 md:gap-0 transition-transform focus-within:scale-105 duration-300">
              <div className="flex items-center flex-1">
                <div className="pl-6 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by landlord name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-400"
                />
              </div>

              {/* City filter — searchable over the dynamically-tracked set of cities */}
              <div className="flex items-center border-t md:border-t-0 md:border-l border-gray-200 md:pl-2">
                <div className="pl-4 md:pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="w-full md:w-56">
                  <CityAutocomplete
                    ariaLabel="Filter by city"
                    value={cityFilter}
                    onChange={setCityFilter}
                    options={cities}
                    placeholder="Any city"
                    clearable
                    inputClassName="w-full p-4 pr-9 text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-blue-200/80">Can't find your landlord?</span>
              <button
                onClick={handleAddLandlordClick}
                className="group flex items-center gap-1 text-white font-semibold hover:text-blue-100 transition-colors"
              >
                Add them now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                <p className="text-gray-600 mb-6">
                  We couldn't find any landlords
                  {searchTerm && <> matching "{searchTerm}"</>}
                  {cityFilter && <> in {cityFilter}</>}
                </p>
                <button
                  onClick={handleAddLandlordClick}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
