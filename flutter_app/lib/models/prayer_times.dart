class PrayerDay {
  final int day;
  final String date;
  final String dayOfWeek;
  final String imsak;
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final String dayLength;

  const PrayerDay({
    required this.day,
    required this.date,
    required this.dayOfWeek,
    required this.imsak,
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    required this.dayLength,
  });

  factory PrayerDay.fromJson(Map<String, dynamic> json) {
    return PrayerDay(
      day: json['day'] as int,
      date: json['date'] as String,
      dayOfWeek: json['day_of_week'] as String,
      imsak: json['imsak'] as String,
      fajr: json['fajr'] as String,
      sunrise: json['sunrise'] as String,
      dhuhr: json['dhuhr'] as String,
      asr: json['asr'] as String,
      maghrib: json['maghrib'] as String,
      isha: json['isha'] as String,
      dayLength: json['day_length'] as String,
    );
  }
}

enum PrayerStatus { past, current, next, upcoming }

class PrayerEntry {
  final String key;
  final String name;
  final String albanianName;
  final String time;
  final PrayerStatus status;
  final bool isSecondary; // imsak & sunrise

  const PrayerEntry({
    required this.key,
    required this.name,
    required this.albanianName,
    required this.time,
    required this.status,
    this.isSecondary = false,
  });
}

class CityOffset {
  final String name;
  final int offsetMinutes;

  const CityOffset({required this.name, required this.offsetMinutes});
}

const List<CityOffset> kosovarCities = [
  CityOffset(name: 'Prishtina', offsetMinutes: -1),
  CityOffset(name: 'Prizren', offsetMinutes: 0),
  CityOffset(name: 'Peja', offsetMinutes: 0),
  CityOffset(name: 'Gjakova', offsetMinutes: 0),
  CityOffset(name: 'Ferizaj', offsetMinutes: -1),
  CityOffset(name: 'Gjilan', offsetMinutes: -1),
  CityOffset(name: 'Mitrovica', offsetMinutes: 0),
  CityOffset(name: 'Deçan', offsetMinutes: 0),
  CityOffset(name: 'Vushtrri', offsetMinutes: -1),
  CityOffset(name: 'Podujeva', offsetMinutes: -1),
  CityOffset(name: 'Sharri', offsetMinutes: 2),
  CityOffset(name: 'Presheva', offsetMinutes: -2),
];
