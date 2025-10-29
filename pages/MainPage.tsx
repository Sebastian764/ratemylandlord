import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import LandlordCard from '../components/LandlordCard';
import type { Landlord } from '../types';

const MainPage: React.FC = () => {
  const { landlords, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLandlords = useMemo(() => {
    if (!searchTerm) {
      return landlords;
    }
    return landlords.filter(landlord =>
      landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, landlords]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">Find Your Landlord</h1>
        <p className="text-lg text-gray-600">Search for landlords in Pittsburgh and read reviews from fellow students.</p>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
           <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div className="text-center my-4">
          <p className="text-base text-gray-600 mb-4">Don't see your landlord?</p>
          <Link to="/add-landlord" className="flex-shrink-0 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-md">
            Add a new Landlord
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">Loading landlords...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLandlords.length > 0 ? (
            filteredLandlords.map((landlord: Landlord) => (
              <LandlordCard key={landlord.id} landlord={landlord} />
            ))
          ) : (
            <p className="text-center col-span-full">No landlords found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
