import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabase';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setHasProfile(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('public_key')
          .eq('id', user.id)
          .single();
        
        // If profile found or specifically if public_key is present
        setHasProfile(!!data?.public_key);
      } catch (err) {
        console.error('Identity Check Failure:', err);
        setHasProfile(false);
      }
    };

    checkProfile();
  }, [user, location.pathname]); // Re-check on navigation to catch initialization completion

  if (loading || (user && hasProfile === null)) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#ff1e1e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no profile, redirect to initialization (unless already there)
  if (!hasProfile && location.pathname !== '/initialize-identity') {
    return <Navigate to="/initialize-identity" replace />;
  }

  // If authenticated AND has profile, but trying to go to initialization, send to dashboard
  if (hasProfile && location.pathname === '/initialize-identity') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
