import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrapper for public-only routes (login, signup)
// Redirects authenticated users to the dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#ff1e1e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard/messages';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
