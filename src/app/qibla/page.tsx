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

  const calculateQiblaDirection = useCallback((coords: Coordinates) => {
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const lat1 = coords.latitude * (Math.PI / 180);
    const lat2 = kaabaLat * (Math.PI / 180);
    const lng1 = coords.longitude * (Math.PI / 180);
    const lng2 = kaabaLng * (Math.PI / 180);
    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
  }, []);

  const handleOrientation: CompassEventHandler = useCallback((event: DeviceOrientationData) => {
    if (event.alpha !== null) setCurrentDirection(event.alpha);
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    if (window.DeviceOrientationEvent?.requestPermission) {
      try {
        setPermissionRequested(true);
        const permission = await window.DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setError(null);
        } else {
          setError('Qasja në busull u refuzua.');
        }
      } catch {
        setError('Gabim gjatë kërkimit të lejes.');
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    const setup = async () => {
      try {
        setIsLoading(true);
        if (!window.DeviceOrientationEvent) {
          setError('Pajisja juaj nuk ka busull.');
          setIsLoading(false);
          return;
        }
        try {
          const userCoords = await getCurrentLocation();
          setCoordinates(userCoords);
        } catch {
          /* use default */
        }
        setQiblaDirection(calculateQiblaDirection(coordinates));
        setIsLoading(false);
        if (!window.DeviceOrientationEvent?.requestPermission) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
      } catch {
        setError('Nuk mund të përcaktohet drejtimi i Kiblës.');
        setIsLoading(false);
      }
    };
    setup();
  }, [coordinates, calculateQiblaDirection, handleOrientation]);

  const compassRotation = useMemo(
    () => (qiblaDirection !== null ? qiblaDirection - currentDirection : 0),
    [qiblaDirection, currentDirection]
  );

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kthehu
          </Link>
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Drejtimi i Kiblës
          </span>
          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      <main className="w-full max-w-lg mx-auto px-3 pt-4 pb-8 space-y-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
              <CompassIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Kibla</p>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <LocationIcon className="w-3 h-3" />
                {coordinates.latitude.toFixed(3)}°, {coordinates.longitude.toFixed(3)}°
              </p>
            </div>
            {qiblaDirection !== null && (
              <div className="ml-auto text-right">
                <p className="text-emerald-400 font-bold text-lg leading-none">
                  {Math.round(qiblaDirection)}°
                </p>
                <p className="text-slate-400 text-xs">nga Veriu</p>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col items-center">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 animate-spin" />
                <p className="text-sm text-slate-500">Duke llogaritur drejtimin…</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
                {window.DeviceOrientationEvent?.requestPermission && !permissionRequested && (
                  <button
                    onClick={requestOrientationPermission}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl"
                  >
                    Lejo busullin
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Compass */}
                <div className="relative w-60 h-60 mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                  {/* Tick marks */}
                  <div className="absolute inset-3 rounded-full border border-dashed border-slate-200 dark:border-slate-700/50" />

                  {/* Cardinal labels */}
                  {[
                    ['N', 'top-1 left-1/2 -translate-x-1/2'],
                    ['E', 'right-1 top-1/2 -translate-y-1/2'],
                    ['S', 'bottom-1 left-1/2 -translate-x-1/2'],
                    ['W', 'left-1 top-1/2 -translate-y-1/2'],
                  ].map(([l, pos]) => (
                    <div
                      key={l}
                      className={`absolute ${pos} text-[10px] font-bold text-slate-400 dark:text-slate-500`}
                    >
                      {l}
                    </div>
                  ))}

                  {/* Rotating needle */}
                  <div
                    className="absolute inset-0 transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                  >
                    {/* Kaaba indicator at top */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                        <span className="text-white text-[7px] font-bold">Ka</span>
                      </div>
                      <div className="w-0.5 h-20 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-800 dark:bg-slate-200 rounded-full border-2 border-white dark:border-slate-900 shadow-md" />
                  </div>
                </div>

                <p className="text-base font-semibold text-slate-800 dark:text-slate-100 text-center">
                  Kibla është{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {Math.round(qiblaDirection || 0)}°
                  </span>{' '}
                  nga Veriu
                </p>

                {/* Info card */}
                <div className="mt-4 w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 space-y-1.5">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                    Si të përdorësh busullin
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Mbaj telefonin shtrirë horizontalisht dhe rrotullo deri sa treguesi jeshil të
                    drejtojë nga ty.
                  </p>
                  {window.DeviceOrientationEvent?.requestPermission && !permissionRequested && (
                    <button
                      onClick={requestOrientationPermission}
                      className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg"
                    >
                      Lejo busullin
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
