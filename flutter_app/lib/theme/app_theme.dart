import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // ── Brand greens ──────────────────────────────────────────────────────────
  static const emerald50  = Color(0xFFECFDF5);
  static const emerald100 = Color(0xFFD1FAE5);
  static const emerald200 = Color(0xFFA7F3D0);
  static const emerald300 = Color(0xFF6EE7B7);
  static const emerald400 = Color(0xFF34D399);
  static const emerald500 = Color(0xFF10B981);
  static const emerald600 = Color(0xFF059669);
  static const emerald700 = Color(0xFF047857);
  static const emerald800 = Color(0xFF065F46);
  static const emerald900 = Color(0xFF064E3B);

  // ── Slate neutrals ────────────────────────────────────────────────────────
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

  // ── Status & accent ───────────────────────────────────────────────────────
  static const amber300 = Color(0xFFFCD34D);
  static const amber400 = Color(0xFFFBBF24);
  static const amber500 = Color(0xFFF59E0B);
  static const blue400  = Color(0xFF60A5FA);
  static const blue500  = Color(0xFF3B82F6);

  // ── Premium dark backgrounds ───────────────────────────────────────────────
  static const darkBg    = Color(0xFF070D17);
  static const darkCard  = Color(0xFF0D1B2A);
  static const darkLayer = Color(0xFF0F2233);

  // ── Gradient stops ────────────────────────────────────────────────────────
  static const gradientTop    = Color(0xFF0A1628);
  static const gradientMid    = Color(0xFF0C2235);
  static const gradientBottom = Color(0xFF072820);
}

const appGradient = LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  stops: [0.0, 0.55, 1.0],
  colors: [
    Color(0xFF0A1628),
    Color(0xFF0C2235),
    Color(0xFF072820),
  ],
);

class AppTheme {
  static TextTheme _textTheme(Color base) => GoogleFonts.poppinsTextTheme(
        TextTheme(
          displayLarge:   TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: base),
          headlineLarge:  TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: base),
          headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: base),
          titleLarge:     TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: base),
          titleMedium:    TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: base),
          bodyLarge:      TextStyle(fontSize: 16, color: base),
          bodyMedium:     TextStyle(fontSize: 14, color: base),
          labelLarge:     TextStyle(fontSize: 13, fontWeight: FontWeight.w600,
                                    color: base, letterSpacing: 0.4),
          labelSmall:     TextStyle(fontSize: 11, fontWeight: FontWeight.w500,
                                    color: base, letterSpacing: 0.6),
        ),
      );

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkBg,
      colorScheme: const ColorScheme.dark(
        primary:   AppColors.emerald400,
        secondary: AppColors.emerald300,
        surface:   AppColors.darkCard,
        onSurface: Colors.white,
        onPrimary: Colors.black,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: Colors.white,
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      textTheme: _textTheme(Colors.white),
      iconTheme: const IconThemeData(color: Colors.white70),
    );
  }

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.slate100,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald600,
        brightness: Brightness.light,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      textTheme: _textTheme(AppColors.slate900),
    );
  }
}
