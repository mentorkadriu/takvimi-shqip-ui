'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ClockIcon } from './icons';
import { getDayPrayerTimes, CITY_OFFSETS, applyCityOffset } from '../services/kosovoPrayerTimes';
import { PrayerTimes as PrayerTimesType } from '../types/prayerTimes';

import PrayerTimesHeader from './prayer-times/PrayerTimesHeader';
import WeekDateSelector from './prayer-times/WeekDateSelector';
import NextPrayerAlert from './prayer-times/NextPrayerAlert';
import PrayerTimesList from './prayer-times/PrayerTimesList';
import LoadingPrayerTimes from './prayer-times/LoadingPrayerTimes';
import ErrorPrayerTimes from './prayer-times/ErrorPrayerTimes';

import { processPrayerTimes } from '../lib/prayerTimeUtils';
import {
  getWeekDates,
  getDateInfo,
  formatTimeAmPm,
  isSameDay,
  getTimeRemaining,
} from '../lib/dateUtils';
import Image from 'next/image';

interface PrayerWithStatus {
  name: string;
  time: string;
  label: string;
  timeInMinutes: number;
  isPast: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cityName, setCityName] = useState('Prishtina');

  // Load persisted city from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved) setCityName(saved);
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setCityName(city);
    localStorage.setItem('selectedCity', city);
  }, []);

  const [weekDates, setWeekDates] = useState(() => getWeekDates(selectedDate));

  useEffect(() => {
    setWeekDates(getWeekDates(selectedDate));
  }, [selectedDate]);

  const formatDate = useCallback(
    (date: Date) => {
      return getDateInfo(date, selectedDate);
    },
    [selectedDate]
  );

  const fetchPrayerTimes = useCallback(
    async (date: Date = selectedDate) => {
      try {
        setIsLoading(true);
        setError(null);

        const times = await getDayPrayerTimes(date);
        setPrayerTimes(times);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Could not load prayer times. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDate]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      fetchPrayerTimes(date);

      const newWeekDates = getWeekDates(date);
      if (JSON.stringify(newWeekDates) !== JSON.stringify(weekDates)) {
        setWeekDates(newWeekDates);
      }
    },
    [fetchPrayerTimes, weekDates]
  );

  useEffect(() => {
    fetchPrayerTimes();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchPrayerTimes]);

  const formatTimeToAmPm = useCallback((time: string) => {
    return formatTimeAmPm(time);
  }, []);

  const getPrayerIcon = useCallback((name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Imsak':
        return (
          <div className="w-10 h-10">
            <Image src="/other-icons/fajr.png" alt="Imsak" width={512} height={512} />
          </div>
        );
      case 'Fajr':
        return <Image src="/other-icons/fajr.png" alt="Fajr" width={40} height={40} />;
      case 'Sunrise':
        return <Image src="/other-icons/lindja-diellit.png" alt="Sunrise" width={40} height={40} />;
      case 'Dhuhr':
        return <Image src="/other-icons/dhuhr.png" alt="Dhuhr" width={40} height={40} />;
      case 'Asr':
        return <Image src="/other-icons/asr.png" alt="Asr" width={40} height={40} />;
      case 'Maghrib':
        return <Image src="/other-icons/iftar.png" alt="Maghrib" width={40} height={40} />;
      case 'Isha':
        return <Image src="/other-icons/isha.png" alt="Isha" width={40} height={40} />;
      default:
        return <ClockIcon className={className} />;
    }
  }, []);

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const {
    prayersWithStatus: prayerTimesWithStatus,
    currentPrayer,
    nextPrayer,
    isNextPrayerTomorrow,
  } = useMemo(() => {
    if (!prayerTimes)
      return {
        prayersWithStatus: [],
        currentPrayer: undefined,
        nextPrayer: undefined,
        isNextPrayerTomorrow: false,
      };

    // Apply the selected city's minute offset to every prayer time
    const offset = CITY_OFFSETS[cityName] ?? 0;
    const t = (raw: string) => applyCityOffset(raw, offset);

    const prayers: PrayerWithStatus[] = [
      {
        name: 'Imsak',
        time: t(prayerTimes.imsak),
        label: 'Imsak',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.imsak)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Fajr',
        time: t(prayerTimes.fajr),
        label: 'Sabahu',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.fajr)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Sunrise',
        time: t(prayerTimes.sunrise),
        label: 'Lindja e Diellit',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.sunrise)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Dhuhr',
        time: t(prayerTimes.dhuhr),
        label: 'Dreka',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.dhuhr)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Asr',
        time: t(prayerTimes.asr),
        label: 'Ikindia',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.asr)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Maghrib',
        time: t(prayerTimes.maghrib),
        label: 'Akshami',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.maghrib)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: 'Isha',
        time: t(prayerTimes.isha),
        label: 'Jacia',
        timeInMinutes: convertTimeToMinutes(t(prayerTimes.isha)),
        isPast: false,
        isCurrent: false,
        isNext: false,
      },
    ];

    return processPrayerTimes(prayers, currentTime);
  }, [prayerTimes, currentTime, cityName]);

  const timeRemaining = useMemo(() => {
    const isToday = isSameDay(selectedDate, new Date());

    if (!nextPrayer || !isToday) return null;

    if (nextPrayer && 'dateTime' in nextPrayer) {
      return getTimeRemaining(nextPrayer.dateTime as Date, currentTime);
    }

    return null;
  }, [nextPrayer, currentTime, selectedDate]);

  const isToday = useMemo(() => {
    return isSameDay(selectedDate, new Date());
  }, [selectedDate]);

  if (isLoading) {
    return <LoadingPrayerTimes />;
  }

  if (error) {
    return <ErrorPrayerTimes error={error} onRetry={() => fetchPrayerTimes()} />;
  }

  if (!prayerTimes) return null;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Dark gradient header */}
      <PrayerTimesHeader
        date={prayerTimes.date}
        weekday={prayerTimes.weekday}
        islamicEvents={prayerTimes.islamicEvents}
        cityName={cityName}
        onCityChange={handleCityChange}
      />

      {/* Body */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        <WeekDateSelector
          onDateSelect={handleDateSelect}
          weekDates={weekDates}
          formatDate={formatDate}
        />

        {isToday && nextPrayer && (
          <NextPrayerAlert
            nextPrayer={nextPrayer}
            timeRemaining={timeRemaining}
            getPrayerIcon={getPrayerIcon}
            currentPrayer={currentPrayer?.name}
            isNextPrayerTomorrow={isNextPrayerTomorrow}
          />
        )}

        <PrayerTimesList
          prayerTimesWithStatus={prayerTimesWithStatus}
          formatTimeToAmPm={formatTimeToAmPm}
          getPrayerIcon={getPrayerIcon}
          isNextPrayerTomorrow={isNextPrayerTomorrow}
          isToday={isToday}
        />
      </div>
    </section>
  );
}
