import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/prayer_times.dart';
import '../services/prayer_times_service.dart';

class PrayerProvider extends ChangeNotifier {
  DateTime _selectedDate = DateTime.now();
  String _selectedCity = 'Prishtina';
  PrayerDay? _prayerDay;
  List<PrayerEntry> _entries = [];
  Duration _timeUntilNext = Duration.zero;
  bool _isLoading = true;
  String? _error;
  Timer? _timer;

  DateTime get selectedDate => _selectedDate;
  String get selectedCity => _selectedCity;
  PrayerDay? get prayerDay => _prayerDay;
  List<PrayerEntry> get entries => _entries;
  Duration get timeUntilNext => _timeUntilNext;
  bool get isLoading => _isLoading;
  String? get error => _error;

  int get cityOffset {
    try {
      return kosovarCities
          .firstWhere((c) => c.name == _selectedCity)
          .offsetMinutes;
    } catch (_) {
      return 0;
    }
  }

  PrayerEntry? get nextPrayer {
    try {
      return _entries.firstWhere((e) => e.status == PrayerStatus.next);
    } catch (_) {
      return null;
    }
  }

  PrayerEntry? get currentPrayer {
    try {
      return _entries.firstWhere((e) => e.status == PrayerStatus.current);
    } catch (_) {
      return null;
    }
  }

  Future<void> init() async {
    _selectedCity = await PrayerTimesService.getSavedCity();
    await _loadDay();
    _startTimer();
  }

  Future<void> _loadDay() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _prayerDay = await PrayerTimesService.getPrayerDay(_selectedDate);
      _recalculate();
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  void _recalculate() {
    if (_prayerDay == null) return;
    final now = DateTime.now();
    _entries = PrayerTimesService.buildPrayerEntries(_prayerDay!, cityOffset, now);
    _timeUntilNext = PrayerTimesService.timeUntilNext(_entries, now);
  }

  void selectDate(DateTime date) {
    _selectedDate = date;
    _loadDay();
  }

  Future<void> selectCity(String city) async {
    _selectedCity = city;
    await PrayerTimesService.saveCity(city);
    _recalculate();
    notifyListeners();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 30), (_) {
      _recalculate();
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
