export interface KosovoPrayerTime {
  imsaku: string;
  sabahu: string;
  lindja_e_diellit: string;
  dreka: string;
  ikindia: string;
  akshami: string;
  jacia: string;
  gjatesia_e_dites: string;
}

export interface KosovoPrayerDay {
  data_sipas_kal_boteror: number;
  dita_javes: string;
  festat_fetare_dhe_shenime_te_tjera_astronomike: string;
  kohet: KosovoPrayerTime;
}

export interface KosovoPrayerMonth {
  [day: string]: {
    kohet: {
      imsaku: string;
      sabahu: string;
      lindja_e_diellit: string;
      dreka: string;
      ikindia: string;
      akshami: string;
      jacia: string;
      gjatesia_e_dites: string;
    };
    dita_javes: string;
    festat_fetare_dhe_shenime_te_tjera_astronomike: string;
  };
}

export interface KosovoPrayerYear {
  [key: string]: KosovoPrayerMonth;
}

// Interface for our processed prayer times
export interface PrayerTimes {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  dayLength: string;
  islamicEvents: string;
  weekday: string;
}

export interface PrayerWithStatus {
  name: string;
  time: string;
  isPast: boolean;
  isCurrent: boolean;
} 