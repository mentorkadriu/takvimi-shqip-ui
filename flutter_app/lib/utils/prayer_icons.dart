import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

/// Gradient colors per prayer (used for the icon bubble background)
class PrayerMeta {
  final List<Color> gradient;
  const PrayerMeta({required this.gradient});
}

const Map<String, PrayerMeta> prayerMeta = {
  'imsak':   PrayerMeta(gradient: [Color(0xFF1A1A2E), Color(0xFF16213E)]),
  'fajr':    PrayerMeta(gradient: [Color(0xFF1C3A4A), Color(0xFF2D5F7A)]),
  'sunrise': PrayerMeta(gradient: [Color(0xFFB45309), Color(0xFFF59E0B)]),
  'dhuhr':   PrayerMeta(gradient: [Color(0xFF047857), Color(0xFF059669)]),
  'asr':     PrayerMeta(gradient: [Color(0xFFD97706), Color(0xFFF59E0B)]),
  'maghrib': PrayerMeta(gradient: [Color(0xFF92400E), Color(0xFFD97706)]),
  'isha':    PrayerMeta(gradient: [Color(0xFF1E1B4B), Color(0xFF312E81)]),
};

/// Returns the Phosphor icon for a prayer key.
/// [fill] switches to the filled weight for active/current states.
PhosphorIconData prayerIcon(String key, {bool fill = false}) {
  final w = fill ? PhosphorIconsStyle.fill : PhosphorIconsStyle.regular;
  switch (key) {
    case 'imsak':
      return PhosphorIcons.moon(PhosphorIconsStyle.fill);
    case 'fajr':
      return PhosphorIcons.sunHorizon(w);
    case 'sunrise':
      return PhosphorIcons.sun(w);
    case 'dhuhr':
      return PhosphorIcons.sun(PhosphorIconsStyle.fill);
    case 'asr':
      return PhosphorIcons.cloudSun(w);
    case 'maghrib':
      return PhosphorIcons.sunHorizon(PhosphorIconsStyle.fill);
    case 'isha':
      return PhosphorIcons.moonStars(PhosphorIconsStyle.fill);
    default:
      return PhosphorIcons.star(w);
  }
}
