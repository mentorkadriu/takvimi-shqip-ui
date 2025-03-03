'use client';

import dynamic from 'next/dynamic';
import LoadingPrayerTimes from './prayer-times/LoadingPrayerTimes';

// Dynamically import the PrayerTimes component with no SSR
// This is necessary because it uses browser APIs like geolocation
const PrayerTimes = dynamic(() => import('./PrayerTimes'), {
  ssr: false,
  loading: () => <LoadingPrayerTimes />
});

export default function ClientPrayerTimesWrapper() {
  return <PrayerTimes />;
} 