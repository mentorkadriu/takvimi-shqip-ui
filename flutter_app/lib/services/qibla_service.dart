import 'dart:math' as math;

class QiblaService {
  // Kaaba coordinates
  static const double _kaabaLat = 21.4225;
  static const double _kaabaLon = 39.8262;

  /// Calculate Qibla bearing from user coordinates (degrees from North, clockwise)
  static double calculateQibla(double userLat, double userLon) {
    final lat1 = _toRad(userLat);
    final lat2 = _toRad(_kaabaLat);
    final dLon = _toRad(_kaabaLon - userLon);

    final y = math.sin(dLon) * math.cos(lat2);
    final x = math.cos(lat1) * math.sin(lat2) -
        math.sin(lat1) * math.cos(lat2) * math.cos(dLon);

    final bearing = math.atan2(y, x);
    return (_toDeg(bearing) + 360) % 360;
  }

  static double _toRad(double deg) => deg * math.pi / 180;
  static double _toDeg(double rad) => rad * 180 / math.pi;
}
