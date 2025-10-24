
import React from 'react';
import type { Landlord } from '../types';
import { Link } from 'react-router-dom';

interface LandlordCardProps {
  landlord: Landlord;
}

const LandlordCard: React.FC<LandlordCardProps> = ({ landlord }) => {
  return (
    <Link to={`/landlord/${landlord.id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-xl font-semibold text-blue-700">{landlord.name}</h3>
        <p className="text-gray-600 mt-2">
          {landlord.address ? `${landlord.address}, ` : ''}{landlord.city}
        </p>
      </div>
    </Link>
  );
};

export default LandlordCard;
