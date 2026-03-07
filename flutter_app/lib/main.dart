import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';
import 'models/prayer_times.dart';
import 'screens/main_shell.dart';
import 'services/notification_service.dart';
import 'services/prayer_provider.dart';
import 'services/prayer_times_service.dart';
import 'services/settings_provider.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Colors.transparent,
  ));

  await initializeDateFormatting('sq', null);
  await NotificationService.init();

  runApp(const TakvimiApp());
}

class TakvimiApp extends StatefulWidget {
  const TakvimiApp({super.key});

  @override
  State<TakvimiApp> createState() => _TakvimiAppState();
}

class _TakvimiAppState extends State<TakvimiApp> {
  late final PrayerProvider   _prayerProvider;
  late final SettingsProvider _settingsProvider;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _prayerProvider   = PrayerProvider();
    _settingsProvider = SettingsProvider();

    _settingsProvider.addListener(_scheduleDebounced);
    _prayerProvider.addListener(_scheduleDebounced);

    _boot();
  }

  Future<void> _boot() async {
    await _settingsProvider.init();
    await _prayerProvider.init();
    await NotificationService.requestPermissions();
    await _reschedule();
  }

  void _scheduleDebounced() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(seconds: 1), _reschedule);
  }

  Future<void> _reschedule() async {
    final today = await PrayerTimesService.getPrayerDay(DateTime.now());
    if (today == null) return;
    final city   = _prayerProvider.selectedCity;
    final offset = kosovarCities
        .firstWhere(
          (c) => c.name == city,
          orElse: () => kosovarCities.first,
        )
        .offsetMinutes;
    final entries =
        PrayerTimesService.buildPrayerEntries(today, offset, DateTime.now());
    await NotificationService.schedulePrayerNotifications(
      entries:  entries,
      settings: _settingsProvider.settings,
    );
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _prayerProvider.removeListener(_scheduleDebounced);
    _settingsProvider.removeListener(_scheduleDebounced);
    _prayerProvider.dispose();
    _settingsProvider.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: _prayerProvider),
        ChangeNotifierProvider.value(value: _settingsProvider),
      ],
      child: MaterialApp(
        title: 'Takvimi Shqip',
        debugShowCheckedModeBanner: false,
        theme:     AppTheme.dark,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.dark,
        home: const _Root(),
      ),
    );
  }
}

class _Root extends StatelessWidget {
  const _Root();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    if (provider.isLoading) return const _Splash();
    if (provider.error != null) return _ErrorScreen(error: provider.error!);
    return const MainShell();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Splash
// ─────────────────────────────────────────────────────────────────────────────
class _Splash extends StatelessWidget {
  const _Splash();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: appGradient),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.emerald600.withValues(alpha: 0.2),
                  border: Border.all(
                      color: AppColors.emerald400.withValues(alpha: 0.4),
                      width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.emerald500.withValues(alpha: 0.25),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Center(
                  child: Text('☪', style: TextStyle(fontSize: 36)),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Takvimi Shqip',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Vaktet e Namazit',
                style: TextStyle(
                  color: AppColors.emerald300.withValues(alpha: 0.7),
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 48),
              SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: AppColors.emerald400.withValues(alpha: 0.6),
                  strokeWidth: 2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Error
// ─────────────────────────────────────────────────────────────────────────────
class _ErrorScreen extends StatelessWidget {
  final String error;
  const _ErrorScreen({required this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: appGradient),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline_rounded,
                    color: AppColors.amber400, size: 52),
                const SizedBox(height: 16),
                const Text('Gabim',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(error,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.6),
                        fontSize: 14)),
                const SizedBox(height: 32),
                FilledButton.icon(
                  onPressed: () => context.read<PrayerProvider>().init(),
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Provo Sërish'),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.emerald600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 14),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
