"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { selectIsAuthenticated } from '@/redux/slice/authslice';

const ProtectedRoute = ({ children }) => {

  const router = useRouter();

  useEffect(() => {
    if (!selectIsAuthenticated) {
      router.push('/login/login');
    }
  }, [selectIsAuthenticated, router]);

  if (!selectIsAuthenticated) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
