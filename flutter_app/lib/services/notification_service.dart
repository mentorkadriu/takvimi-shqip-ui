import 'dart:io';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tz_data;
import 'package:timezone/timezone.dart' as tz;
import '../models/notification_settings.dart';
import '../models/prayer_times.dart';

class NotificationService {
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static const _channelId   = 'prayer_times';
  static const _channelName = 'Vaktet e Namazit';
  static const _channelDesc = 'Njoftimet për vaktet e namazit';

  // Kosovo / Serbia timezone
  static const _tz = 'Europe/Belgrade';

  static const Map<String, int> _ids = {
    'imsak':   0,
    'fajr':    1,
    'sunrise': 2,
    'dhuhr':   3,
    'asr':     4,
    'maghrib': 5,
    'isha':    6,
  };

  static const Map<String, String> _names = {
    'imsak':   'Imsaku',
    'fajr':    'Sabahu',
    'sunrise': 'Lindja e Diellit',
    'dhuhr':   'Dreka',
    'asr':     'Ikindia',
    'maghrib': 'Akshami',
    'isha':    'Jacia',
  };

  // ─── Init ──────────────────────────────────────────────────────────────────

  static Future<void> init() async {
    if (_initialized) return;
    tz_data.initializeTimeZones();
    tz.setLocalLocation(tz.getLocation(_tz));

    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const darwinInit  = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    const settings = InitializationSettings(
      android: androidInit,
      iOS:     darwinInit,
      macOS:   darwinInit,
    );
    await _plugin.initialize(settings);
    _initialized = true;
  }

  // ─── Permissions ───────────────────────────────────────────────────────────

  static Future<bool> requestPermissions() async {
    if (Platform.isAndroid) {
      final impl = _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      return (await impl?.requestNotificationsPermission()) ?? false;
    }
    if (Platform.isIOS) {
      final impl = _plugin.resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin>();
      return (await impl?.requestPermissions(
            alert: true, badge: true, sound: true)) ??
          false;
    }
    if (Platform.isMacOS) {
      final impl = _plugin.resolvePlatformSpecificImplementation<
          MacOSFlutterLocalNotificationsPlugin>();
      return (await impl?.requestPermissions(
            alert: true, badge: false, sound: true)) ??
          false;
    }
    return false;
  }

  // ─── Cancel ────────────────────────────────────────────────────────────────

  static Future<void> cancelAll() => _plugin.cancelAll();

  // ─── Schedule ──────────────────────────────────────────────────────────────

  static Future<void> schedulePrayerNotifications({
    required List<PrayerEntry> entries,
    required NotificationSettings settings,
  }) async {
    if (!_initialized) await init();
    await cancelAll();
    if (!settings.masterEnabled) return;

    final location = tz.getLocation(_tz);
    final now      = tz.TZDateTime.now(location);

    for (final entry in entries) {
      final enabled = settings.prayers[entry.key] ?? false;
      if (!enabled) continue;

      final id = _ids[entry.key] ?? 99;

      // Parse HH:mm
      final parts = entry.time.split(':');
      if (parts.length != 2) continue;
      final hour   = int.tryParse(parts[0]) ?? 0;
      final minute = int.tryParse(parts[1]) ?? 0;

      // Subtract advance offset, schedule for today first
      var scheduled = tz.TZDateTime(location, now.year, now.month, now.day,
              hour, minute)
          .subtract(Duration(minutes: settings.advanceMinutes));

      // Already past → tomorrow
      if (scheduled.isBefore(now)) {
        scheduled = scheduled.add(const Duration(days: 1));
      }

      final name = _names[entry.key] ?? entry.albanianName;
      final body = settings.advanceMinutes > 0
          ? 'Pas ${settings.advanceMinutes} minutash'
          : 'Ka ardhur koha e namazit';

      final androidDetails = AndroidNotificationDetails(
        _channelId,
        _channelName,
        channelDescription: _channelDesc,
        importance:       Importance.high,
        priority:         Priority.high,
        playSound:        settings.soundEnabled,
        enableVibration:  true,
      );
      final darwinDetails = DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: false,
        presentSound: settings.soundEnabled,
      );
      final details = NotificationDetails(
        android: androidDetails,
        iOS:     darwinDetails,
        macOS:   darwinDetails,
      );

      await _plugin.zonedSchedule(
        id,
        name,
        body,
        scheduled,
        details,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.wallClockTime,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        matchDateTimeComponents: DateTimeComponents.time,
      );
    }
  }
}
