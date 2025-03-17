
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-3 gap-4'} max-w-5xl mx-auto`}>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">LaundryNectar</h3>
            <p className="text-sm text-gray-600">
              Professional laundry service that makes your life easier.
            </p>
          </div>
          
          {!isMobile && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-laundry-600 transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-sm text-gray-600 hover:text-laundry-600 transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="text-sm text-gray-600 hover:text-laundry-600 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Contact</h3>
            <p className="text-sm text-gray-600">
              123 Laundry Lane, Fresh City<br />
              contact@laundrynectar.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-4 text-center text-xs text-gray-500 max-w-5xl mx-auto">
          <p>&copy; {new Date().getFullYear()} LaundryNectar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
