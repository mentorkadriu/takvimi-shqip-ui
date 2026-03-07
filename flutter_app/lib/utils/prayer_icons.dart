import 'package:flutter/material.dart';

/// Returns an icon and gradient for each prayer key
class PrayerMeta {
  final IconData icon;
  final List<Color> gradient;
  final String emoji;

  const PrayerMeta({
    required this.icon,
    required this.gradient,
    required this.emoji,
  });
}

const Map<String, PrayerMeta> prayerMeta = {
  'imsak': PrayerMeta(
    icon: Icons.bedtime_outlined,
    gradient: [Color(0xFF1A1A2E), Color(0xFF16213E)],
    emoji: '🌙',
  ),
  'fajr': PrayerMeta(
    icon: Icons.wb_twilight,
    gradient: [Color(0xFF1C3A4A), Color(0xFF2D5F7A)],
    emoji: '🌅',
  ),
  'sunrise': PrayerMeta(
    icon: Icons.wb_sunny_outlined,
    gradient: [Color(0xFFF59E0B), Color(0xFFFBBF24)],
    emoji: '🌄',
  ),
  'dhuhr': PrayerMeta(
    icon: Icons.light_mode,
    gradient: [Color(0xFF047857), Color(0xFF059669)],
    emoji: '☀️',
  ),
  'asr': PrayerMeta(
    icon: Icons.wb_sunny,
    gradient: [Color(0xFFD97706), Color(0xFFF59E0B)],
    emoji: '🌤',
  ),
  'maghrib': PrayerMeta(
    icon: Icons.nightlight_round,
    gradient: [Color(0xFFB45309), Color(0xFFD97706)],
    emoji: '🌇',
  ),
  'isha': PrayerMeta(
    icon: Icons.nightlight,
    gradient: [Color(0xFF1E1B4B), Color(0xFF312E81)],
    emoji: '🌃',
  ),
};
