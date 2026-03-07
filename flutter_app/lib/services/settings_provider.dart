import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification_settings.dart';

class SettingsProvider extends ChangeNotifier {
  static const _prefsKey = 'notification_settings_v1';

  NotificationSettings _settings = const NotificationSettings();
  NotificationSettings get settings => _settings;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefsKey);
    if (raw != null) {
      try {
        _settings = NotificationSettings.fromJson(
          Map<String, dynamic>.from(jsonDecode(raw) as Map),
        );
      } catch (_) {
        // Corrupt data → keep defaults
      }
    }
    notifyListeners();
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, jsonEncode(_settings.toJson()));
  }

  Future<void> setMasterEnabled(bool v) async {
    _settings = _settings.copyWith(masterEnabled: v);
    notifyListeners();
    await _persist();
  }

  Future<void> setSoundEnabled(bool v) async {
    _settings = _settings.copyWith(soundEnabled: v);
    notifyListeners();
    await _persist();
  }

  Future<void> setAdvanceMinutes(int v) async {
    _settings = _settings.copyWith(advanceMinutes: v);
    notifyListeners();
    await _persist();
  }

  Future<void> setPrayerEnabled(String prayer, bool v) async {
    final map = Map<String, bool>.from(_settings.prayers);
    map[prayer] = v;
    _settings = _settings.copyWith(prayers: map);
    notifyListeners();
    await _persist();
  }
}
