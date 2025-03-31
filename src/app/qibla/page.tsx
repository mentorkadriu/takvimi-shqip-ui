'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { CompassIcon, LocationIcon } from '../components/icons';
import { getCurrentLocation, DEFAULT_COORDINATES, Coordinates } from '../services/prayerTimes';

interface DeviceOrientationData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface DeviceOrientationEvent {
  requestPermission?: () => Promise<PermissionState>;
}

interface CompassEventHandler {
  (event: DeviceOrientationData): void;
}

declare global {
  interface Window {
    DeviceOrientationEvent: DeviceOrientationEvent;
  }
}

export default function QiblaPage() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentDirection, setCurrentDirection] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Calculate Qibla direction - memoized with useCallback
  const calculateQiblaDirection = useCallback((coords: Coordinates) => {
    // Coordinates of the Kaaba
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const lat1 = coords.latitude * (Math.PI / 180);
    const lat2 = kaabaLat * (Math.PI / 180);
    const lng1 = coords.longitude * (Math.PI / 180);
    const lng2 = kaabaLng * (Math.PI / 180);
    
    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360; // Normalize to 0-360
    
    return qibla;
  }, []);

  // Handle device orientation events
  const handleOrientation: CompassEventHandler = useCallback((event: DeviceOrientationData) => {
    if (event.alpha !== null) {
      setCurrentDirection(event.alpha);
    }
  }, []);

  // Request device orientation permission
  const requestOrientationPermission = useCallback(async () => {
    if (window.DeviceOrientationEvent?.requestPermission) {
      try {
        setPermissionRequested(true);
        const permission = await window.DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setError(null);
        } else {
          setError("Permission to access device orientation was denied.");
        }
      } catch (error: unknown) {
        console.error('Error requesting permission:', error);
        setError("Error requesting device orientation permission.");
      }
    } else {
      // For non-iOS devices or older iOS versions
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }, [handleOrientation]);

  // Setup Qibla direction
  useEffect(() => {
    const setupQibla = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if device has compass
        if (!window.DeviceOrientationEvent) {
          setError("Your device doesn&apos;t support compass functionality.");
          setIsLoading(false);
          return;
        }
        
        // Get user location
        try {
          const userCoords = await getCurrentLocation();
          setCoordinates(userCoords);
        } catch (locationError) {
          console.warn('Could not get user location, using default:', locationError);
          // Continue with default coordinates
        }
        
        // Calculate Qibla direction
        const qibla = calculateQiblaDirection(coordinates);
        setQiblaDirection(qibla);
        setIsLoading(false);
        
        // Setup device orientation for non-iOS or if permission already granted
        if (!window.DeviceOrientationEvent?.requestPermission) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
        
        return () => {
          window.removeEventListener('deviceorientation', handleOrientation, true);
        };
      } catch (error: unknown) {
        console.error('Error setting up Qibla direction:', error);
        setError('Could not determine Qibla direction. Please try again later.');
        setIsLoading(false);
      }
    };
    
    setupQibla();
  }, [coordinates, calculateQiblaDirection, handleOrientation]);

  // Calculate the rotation for the compass - memoized
  const compassRotation = useMemo(() => 
    qiblaDirection !== null ? qiblaDirection - currentDirection : 0
  , [qiblaDirection, currentDirection]);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <header className="w-full max-w-4xl mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-xl font-bold">Qibla Direction</h1>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto grid gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Determining Qibla direction...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              {window.DeviceOrientationEvent?.requestPermission && !permissionRequested && (
                <button 
                  onClick={requestOrientationPermission}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Grant Compass Permission
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="relative w-64 h-64 mb-8">
                {/* Compass background */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                
                {/* Cardinal directions */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute top-2 text-center font-medium">N</div>
                  <div className="absolute right-2 font-medium">E</div>
                  <div className="absolute bottom-2 text-center font-medium">S</div>
                  <div className="absolute left-2 font-medium">W</div>
                </div>
                
                {/* Compass needle */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${compassRotation}deg)` }}
                >
                  <div className="relative w-full h-full">
                    {/* Qibla direction indicator */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">Ka&apos;ba</span>
                      </div>
                    </div>
                    
                    {/* Compass arrow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1/2 bg-gradient-to-t from-transparent to-red-500 transform -translate-y-1/4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Compass icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <CompassIcon className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Qibla is <span className="text-green-500">{Math.round(qiblaDirection || 0)}°</span> from North
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <LocationIcon className="w-4 h-4" />
                  {coordinates.latitude.toFixed(4)}°, {coordinates.longitude.toFixed(4)}°
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p>Point your phone towards the Ka&apos;ba and align it with the green indicator.</p>
                <p className="mt-2">For best results, hold your device flat and away from magnetic interference.</p>
                {window.DeviceOrientationEvent?.requestPermission && !permissionRequested && (
                  <button 
                    onClick={requestOrientationPermission}
                    className="mt-3 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs w-full"
                  >
                    Grant Compass Permission
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
} 
