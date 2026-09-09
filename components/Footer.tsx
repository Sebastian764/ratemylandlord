import { useCity } from '../cities/context';
import React from 'react';
import { Link } from '../cities/routing';

const Footer: React.FC = () => {
  const city = useCity();
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {city?.brand ?? 'RateYinzLandlord'} {city?.name ?? 'Pittsburgh'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms-and-conditions" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Contact Support
            </Link>
            <Link to="/resources" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Resources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;