/// Simple Gregorian → Hijri calendar conversion.
/// Uses the tabular Islamic calendar algorithm.
class HijriService {
  static const List<String> _hijriMonths = [
    'Muharrem', 'Safer', 'Rabi\'ul-Evvel', 'Rabi\'ul-Ahir',
    'Jumadal-Ula', 'Jumadal-Uhra', 'Rexheb', 'Sha\'ban',
    'Ramazan', 'Sheval', 'Dhul-Ka\'de', 'Dhul-Hixhxhe',
  ];

  static String toHijriString(DateTime date) {
    final h = _toHijri(date);
    return '${h.$3} ${_hijriMonths[h.$2 - 1]} ${h.$1}';
  }

  static (int year, int month, int day) _toHijri(DateTime date) {
    final jd = _gregorianToJD(date.year, date.month, date.day);
    return _jdToHijri(jd);
  }

  static int _gregorianToJD(int y, int m, int d) {
    final a = (14 - m) ~/ 12;
    final year = y + 4800 - a;
    final month = m + 12 * a - 3;
    return d +
        (153 * month + 2) ~/ 5 +
        365 * year +
        year ~/ 4 -
        year ~/ 100 +
        year ~/ 400 -
        32045;
  }

  static (int, int, int) _jdToHijri(int jd) {
    final l = jd - 1948440 + 10632;
    final n = (l - 1) ~/ 10631;
    final l2 = l - 10631 * n + 354;
    final j = ((10985 - l2) ~/ 5316) * ((50 * l2) ~/ 17719) +
        (l2 ~/ 5670) * ((43 * l2) ~/ 15238);
    final l3 = l2 - ((30 - j) ~/ 15) * ((17719 * j) ~/ 50) -
        (j ~/ 16) * ((15238 * j) ~/ 43) +
        29;
    final month = (24 * l3) ~/ 709;
    final day = l3 - (709 * month) ~/ 24;
    final year = 30 * n + j - 30;
    return (year, month, day);
  }
}
