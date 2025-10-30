import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="bg-gray-100 dark:bg-gray-900">
        <p className="text-center py-4 text-white">
          Rate My Landlord | <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;