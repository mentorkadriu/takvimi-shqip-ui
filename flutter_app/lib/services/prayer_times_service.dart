import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/prayer_times.dart';

class PrayerTimesService {
  static const _cityKey = 'selectedCity';
  static Map<String, List<PrayerDay>>? _cachedData;

  static const Map<String, String> _monthNames = {
    'January': 'Janar',
    'February': 'Shkurt',
    'March': 'Mars',
    'April': 'Prill',
    'May': 'Maj',
    'June': 'Qershor',
    'July': 'Korrik',
    'August': 'Gusht',
    'September': 'Shtator',
    'October': 'Tetor',
    'November': 'Nëntor',
    'December': 'Dhjetor',
  };

  static const Map<int, String> _monthKeys = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  static String albanianMonth(int month) {
    return _monthNames[_monthKeys[month]!] ?? '';
  }

  static Future<void> _ensureLoaded() async {
    if (_cachedData != null) return;
    final raw = await rootBundle.loadString('assets/data/kosovo-prayer-times.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    final prayerTimes = json['prayer_times'] as Map<String, dynamic>;

    _cachedData = {};
    for (final entry in prayerTimes.entries) {
      final days = (entry.value as List)
          .map((d) => PrayerDay.fromJson(d as Map<String, dynamic>))
          .toList();
      _cachedData![entry.key] = days;
    }
  }

  static Future<PrayerDay?> getPrayerDay(DateTime date) async {
    await _ensureLoaded();
    final monthKey = _monthKeys[date.month]!;
    final days = _cachedData![monthKey];
    if (days == null) return null;
    try {
      return days.firstWhere((d) => d.day == date.day);
    } catch (_) {
      return null;
    }
  }

  static Future<List<PrayerDay>> getWeekDays(DateTime startDate) async {
    await _ensureLoaded();
    final result = <PrayerDay>[];
    for (int i = 0; i < 7; i++) {
      final day = startDate.add(Duration(days: i));
      final pd = await getPrayerDay(day);
      if (pd != null) result.add(pd);
    }
    return result;
  }

  // Apply city minute offset
  static String applyOffset(String time, int offsetMinutes) {
    if (offsetMinutes == 0) return time;
    final parts = time.split(':');
    int h = int.parse(parts[0]);
    int m = int.parse(parts[1]);
    final total = h * 60 + m + offsetMinutes;
    final newH = (total ~/ 60) % 24;
    final newM = total % 60;
    return '${newH.toString().padLeft(2, '0')}:${newM.toString().padLeft(2, '0')}';
  }

  // City persistence
  static Future<String> getSavedCity() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_cityKey) ?? 'Prishtina';
  }

  static Future<void> saveCity(String city) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_cityKey, city);
  }

  // Calculate prayer statuses
  static List<PrayerEntry> buildPrayerEntries(
    PrayerDay day,
    int offsetMinutes,
    DateTime now,
  ) {
    final prayers = [
      ('imsak', 'Imsaku', 'Imsak', true),
      ('fajr', 'Sabahu', 'Fajr', false),
      ('sunrise', 'Lindja e Diellit', 'Sunrise', true),
      ('dhuhr', 'Dreka', 'Dhuhr', false),
      ('asr', 'Ikindia', 'Asr', false),
      ('maghrib', 'Akshami', 'Maghrib', false),
      ('isha', 'Jacia', 'Isha', false),
    ];

    final rawTimes = {
      'imsak': day.imsak,
      'fajr': day.fajr,
      'sunrise': day.sunrise,
      'dhuhr': day.dhuhr,
      'asr': day.asr,
      'maghrib': day.maghrib,
      'isha': day.isha,
    };

    final adjustedTimes = rawTimes.map(
      (k, v) => MapEntry(k, applyOffset(v, offsetMinutes)),
    );

    final nowMins = now.hour * 60 + now.minute;

    // Find next main prayer (not imsak/sunrise)
    final mainPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    int? nextIdx;
    for (int i = 0; i < mainPrayers.length; i++) {
      final t = _toMinutes(adjustedTimes[mainPrayers[i]]!);
      if (t > nowMins) {
        nextIdx = i;
        break;
      }
    }
    final nextMain = nextIdx != null ? mainPrayers[nextIdx] : null;
    final currentMain = nextIdx != null && nextIdx > 0
        ? mainPrayers[nextIdx - 1]
        : (nextIdx == null ? mainPrayers.last : null);

    return prayers.map((p) {
      final key = p.$1;
      final albanianName = p.$2;
      final englishName = p.$3;
      final isSecondary = p.$4;
      final time = adjustedTimes[key]!;
      final timeMins = _toMinutes(time);

      PrayerStatus status;
      if (isSecondary) {
        status = timeMins <= nowMins ? PrayerStatus.past : PrayerStatus.upcoming;
      } else if (key == currentMain) {
        status = PrayerStatus.current;
      } else if (key == nextMain) {
        status = PrayerStatus.next;
      } else if (timeMins <= nowMins) {
        status = PrayerStatus.past;
      } else {
        status = PrayerStatus.upcoming;
      }

      return PrayerEntry(
        key: key,
        name: englishName,
        albanianName: albanianName,
        time: time,
        status: status,
        isSecondary: isSecondary,
      );
    }).toList();
  }

  static int _toMinutes(String time) {
    final parts = time.split(':');
    return int.parse(parts[0]) * 60 + int.parse(parts[1]);
  }

  static Duration timeUntilNext(List<PrayerEntry> entries, DateTime now) {
    final next = entries.where((e) => e.status == PrayerStatus.next).firstOrNull;
    if (next == null) return Duration.zero;
    final t = _toMinutes(next.time);
    final nowMins = now.hour * 60 + now.minute;
    int diff = t - nowMins;
    if (diff < 0) diff += 24 * 60;
    return Duration(minutes: diff);
  }
}
