
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shirt, User, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-laundry-700" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-white p-0 w-[80%]">
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-8 pb-4 border-b">
            <div className="flex items-center space-x-2">
              <Shirt className="h-6 w-6 text-laundry-600" />
              <span className="text-xl font-bold text-laundry-700">LaundryNectar</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-6">
              {currentUser ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-laundry-600 transition-colors text-lg font-medium block"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/order-history" 
                      className="text-gray-700 hover:text-laundry-600 transition-colors text-lg font-medium block"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-laundry-600 transition-colors text-lg font-medium flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                  </li>
                  <li className="pt-6 mt-6 border-t">
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }} 
                      variant="outline" 
                      className="w-full border-laundry-600 text-laundry-600 hover:bg-laundry-50"
                    >
                      Log Out
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-laundry-600 transition-colors text-lg font-medium block"
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </Link>
                  </li>
                  <li className="mt-4">
                    <Link 
                      to="/signup" 
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full bg-laundry-600 hover:bg-laundry-700 text-white">Sign Up</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shirt className="h-8 w-8 text-laundry-600" />
          <span className="text-xl md:text-2xl font-bold text-laundry-700">LaundryNectar</span>
        </Link>
        
        {isMobile ? (
          <MobileMenu />
        ) : (
          <nav>
            <ul className="flex items-center space-x-6">
              {currentUser ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-gray-600 hover:text-laundry-600 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/order-history" className="text-gray-600 hover:text-laundry-600 transition-colors">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-gray-600 hover:text-laundry-600 transition-colors flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </Link>
                  </li>
                  <li className="ml-6">
                    <Button onClick={handleLogout} variant="outline" className="border-laundry-600 text-laundry-600 hover:bg-laundry-50">
                      Log Out
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-600 hover:text-laundry-600 transition-colors">
                      Log In
                    </Link>
                  </li>
                  <li className="ml-4">
                    <Link to="/signup">
                      <Button className="bg-laundry-600 hover:bg-laundry-700 text-white">Sign Up</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
