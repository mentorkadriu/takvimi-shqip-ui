import 'package:flutter/material.dart';

class AppColors {
  // Primary brand — teal/emerald
  static const emerald50 = Color(0xFFECFDF5);
  static const emerald100 = Color(0xFFD1FAE5);
  static const emerald400 = Color(0xFF34D399);
  static const emerald500 = Color(0xFF10B981);
  static const emerald600 = Color(0xFF059669);
  static const emerald700 = Color(0xFF047857);
  static const emerald800 = Color(0xFF065F46);
  static const emerald900 = Color(0xFF064E3B);

  // Surface tones
  static const slate50  = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate200 = Color(0xFFE2E8F0);
  static const slate300 = Color(0xFFCBD5E1);
  static const slate400 = Color(0xFF94A3B8);
  static const slate500 = Color(0xFF64748B);
  static const slate600 = Color(0xFF475569);
  static const slate700 = Color(0xFF334155);
  static const slate800 = Color(0xFF1E293B);
  static const slate900 = Color(0xFF0F172A);

  // Status
  static const amber400 = Color(0xFFFBBF24);
  static const amber500 = Color(0xFFF59E0B);
  static const blue400  = Color(0xFF60A5FA);
  static const blue500  = Color(0xFF3B82F6);
  static const blue900  = Color(0xFF1E3A5F);
}

class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald600,
        brightness: Brightness.light,
        primary: AppColors.emerald600,
        onPrimary: Colors.white,
        secondary: AppColors.emerald400,
        surface: AppColors.slate50,
        onSurface: AppColors.slate900,
      ),
      scaffoldBackgroundColor: AppColors.slate100,
      appBarTheme: const AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: Colors.white,
      ),
      textTheme: _buildTextTheme(Brightness.light),
    );
  }

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald500,
        brightness: Brightness.dark,
        primary: AppColors.emerald500,
        onPrimary: Colors.white,
        secondary: AppColors.emerald400,
        surface: AppColors.slate800,
        onSurface: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.slate900,
      appBarTheme: const AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: AppColors.slate800,
      ),
      textTheme: _buildTextTheme(Brightness.dark),
    );
  }

  static TextTheme _buildTextTheme(Brightness brightness) {
    final baseColor = brightness == Brightness.light ? AppColors.slate900 : Colors.white;
    return TextTheme(
      displayLarge: TextStyle(
        fontSize: 32, fontWeight: FontWeight.bold, color: baseColor, letterSpacing: -0.5),
      displayMedium: TextStyle(
        fontSize: 28, fontWeight: FontWeight.bold, color: baseColor),
      headlineLarge: TextStyle(
        fontSize: 24, fontWeight: FontWeight.bold, color: baseColor),
      headlineMedium: TextStyle(
        fontSize: 20, fontWeight: FontWeight.w600, color: baseColor),
      titleLarge: TextStyle(
        fontSize: 18, fontWeight: FontWeight.w600, color: baseColor),
      titleMedium: TextStyle(
        fontSize: 16, fontWeight: FontWeight.w500, color: baseColor),
      bodyLarge: TextStyle(fontSize: 16, color: baseColor),
      bodyMedium: TextStyle(fontSize: 14, color: baseColor),
      labelLarge: TextStyle(
        fontSize: 14, fontWeight: FontWeight.w600, color: baseColor, letterSpacing: 0.5),
    );
  }
}
