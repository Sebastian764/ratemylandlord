
import React from 'react';
import type { Landlord } from '../types';
import { Link } from 'react-router-dom';

interface LandlordCardProps {
  landlord: Landlord;
}

const LandlordCard: React.FC<LandlordCardProps> = ({ landlord }) => {
  return (
    <Link to={`/landlord/${landlord.id}`} className="block group h-full">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-2 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {landlord.status === 'pending' && (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
              Pending
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
          {landlord.name}
        </h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-start gap-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">
              {landlord.addresses && landlord.addresses.length > 0 ? `${landlord.addresses.join(', ')}, ` : ''}{landlord.city}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LandlordCard;
