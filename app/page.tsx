'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { verifyToken } from './services/tokenVerification';
import UnauthorizedAccess from './components/UnauthorizedAccess';

// Dynamic import to avoid SSR issues with Leaflet
const MapViewer = dynamic(() => import('./components/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Loading Virtual Map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Try to get token from URL params first
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');

        // If no token in URL, try localStorage
        if (!token) {
          token = localStorage.getItem('auth_token');
        } else {
          // If token is in URL, save it to localStorage for future visits
          localStorage.setItem('auth_token', token);
        }

        if (!token) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Verify token with the API
        const isValid = await verifyToken(token);
        setIsAuthorized(isValid);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }

  return <MapViewer />;
}