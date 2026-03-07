# Takvimi Shqip — Flutter App

A modern, beautiful Islamic prayer times app for Kosovo/Albania built with Flutter 3.x.

## Features

- **Prayer Times** — Displays all 7 prayer times (Imsak, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) with current/next/past status
- **City Selector** — 12 Kosovar cities with automatic minute-offset adjustments
- **Week Date Selector** — Horizontal scrollable 7-day picker
- **Next Prayer Countdown** — Live countdown to the next prayer with animated card
- **Hijri Calendar** — Converts today's Gregorian date to Islamic/Hijri calendar
- **Qibla Compass** — Real-time compass pointing to Mecca using device magnetometer
- **Dark Mode** — Full system dark/light theme support
- **Offline First** — All 2026 prayer times bundled locally (BIK Kosovo official source)
- **Beautiful Animations** — Smooth enter animations via `flutter_animate`

## Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart                    # App entry point, splash, error screens
│   ├── models/
│   │   └── prayer_times.dart        # Data models (PrayerDay, PrayerEntry, CityOffset)
│   ├── services/
│   │   ├── prayer_times_service.dart # Load JSON, apply city offsets, calculate statuses
│   │   ├── prayer_provider.dart      # ChangeNotifier state management
│   │   ├── qibla_service.dart        # Great-circle Qibla bearing calculation
│   │   └── hijri_service.dart        # Gregorian → Hijri calendar conversion
│   ├── screens/
│   │   ├── main_shell.dart           # Bottom navigation shell
│   │   ├── home_screen.dart          # Home with prayer times
│   │   └── qibla_screen.dart         # Qibla compass screen
│   ├── widgets/
│   │   ├── week_date_selector.dart   # Horizontal date picker
│   │   ├── next_prayer_card.dart     # Countdown card for next prayer
│   │   ├── prayer_times_list.dart    # List of all prayer entries
│   │   ├── city_selector_sheet.dart  # Bottom sheet city grid
│   │   └── qibla_compass.dart        # Compass widget with magnetometer
│   ├── theme/
│   │   └── app_theme.dart            # Light/dark MaterialTheme + color palette
│   └── utils/
│       └── prayer_icons.dart         # Prayer emoji & gradient metadata
├── assets/
│   └── data/
│       └── kosovo-prayer-times.json  # Official BIK Kosovo 2026 prayer times
├── android/                          # Android platform files
├── ios/                              # iOS platform files
└── pubspec.yaml                      # Dependencies
```

## Getting Started

### Prerequisites

- Flutter SDK ≥ 3.3.0 (use Flutter 3.19+ recommended)
- Dart ≥ 3.3.0
- Xcode 15+ (iOS)
- Android Studio / Android SDK (Android)

### Setup

```bash
cd flutter_app

# Install dependencies
flutter pub get

# Run on device/simulator
flutter run

# Build release APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

### Permissions Required

| Platform | Permission | Reason |
|----------|-----------|--------|
| Android | `ACCESS_FINE_LOCATION` | Qibla compass location |
| Android | `INTERNET` | Future API calls |
| iOS | `NSLocationWhenInUseUsageDescription` | Qibla compass |
| iOS | `NSMotionUsageDescription` | Magnetometer for compass |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `provider` | State management |
| `geolocator` | GPS location for Qibla |
| `sensors_plus` | Magnetometer for compass heading |
| `shared_preferences` | Persist selected city |
| `intl` | Albanian date formatting |
| `hijri` | Hijri calendar conversion |
| `flutter_animate` | Smooth animations |
| `connectivity_plus` | Network state |

## Data Source

Prayer times are sourced from the **Islamic Community of Kosovo (BIK)** official takvim for 2026, bundled as a local JSON asset. The reference point is Deçan (westernmost Kosovo city) with city-specific minute offsets.

**Calculation method:** BIM Kosovo — Fajr angle 18°, Isha angle 17°, Temkin 6 min.

## Architecture

- **State**: Provider (`ChangeNotifier`) — single `PrayerProvider` with 30-second timer
- **Data**: Offline-first JSON asset, optionally Aladhan API for future use
- **Navigation**: Indexed Stack with custom bottom nav bar (no package needed)
- **Theme**: Material 3 with `ColorScheme.fromSeed` in emerald/teal palette
