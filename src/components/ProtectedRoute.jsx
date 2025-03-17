
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ProtectedRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!currentUser && location.pathname !== '/login') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }
  }, [currentUser, location.pathname]);
  
  if (!currentUser) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  return children;
};

export default ProtectedRoute;
