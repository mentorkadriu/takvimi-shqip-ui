import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../services/prayer_provider.dart';
import '../theme/app_theme.dart';
import '../utils/prayer_icons.dart';

class NextPrayerCard extends StatelessWidget {
  const NextPrayerCard({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final next    = provider.nextPrayer;
    final current = provider.currentPrayer;
    final remaining = provider.timeUntilNext;

    if (next == null && current == null) return const SizedBox.shrink();

    final prayer = next ?? current!;
    final meta   = prayerMeta[prayer.key] ?? prayerMeta['dhuhr']!;
    final hours   = remaining.inHours;
    final minutes = remaining.inMinutes % 60;

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.emerald500.withValues(alpha: 0.28),
                  AppColors.emerald800.withValues(alpha: 0.20),
                ],
              ),
              border: Border.all(
                color: AppColors.emerald400.withValues(alpha: 0.25),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // ── Left: label + name + countdown ──────────────────────
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _PillLabel(
                          label: next != null ? 'Namazi i Radhës' : 'Namazi Aktual',
                        ),
                        const SizedBox(height: 10),
                        Text(
                          prayer.albanianName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 26,
                            fontWeight: FontWeight.w700,
                            height: 1.1,
                          ),
                        ),
                        Text(
                          prayer.name,
                          style: TextStyle(
                            color: AppColors.emerald300.withValues(alpha: 0.7),
                            fontSize: 13,
                          ),
                        ),
                        if (next != null && remaining > Duration.zero) ...[
                          const SizedBox(height: 14),
                          _CountdownChips(hours: hours, minutes: minutes),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  // ── Right: emoji + time ──────────────────────────────────
                  _TimeOrb(time: prayer.time, emoji: meta.emoji),
                ],
              ),
            ),
          ),
        ),
      )
          .animate()
          .fadeIn(duration: 500.ms)
          .slideY(begin: 0.15, end: 0, duration: 500.ms, curve: Curves.easeOut),
    );
  }
}

class _PillLabel extends StatelessWidget {
  final String label;
  const _PillLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.emerald400.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: AppColors.emerald400.withValues(alpha: 0.3)),
      ),
      child: Text(
        label.toUpperCase(),
        style: const TextStyle(
          color: AppColors.emerald300,
          fontSize: 9,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _CountdownChips extends StatelessWidget {
  final int hours;
  final int minutes;
  const _CountdownChips({required this.hours, required this.minutes});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.schedule_rounded, size: 13, color: AppColors.emerald400),
        const SizedBox(width: 5),
        Text('Mbetet  ', style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12)),
        if (hours > 0) ...[
          _Chip(value: hours, unit: 'orë'),
          const SizedBox(width: 6),
        ],
        _Chip(value: minutes, unit: 'min'),
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  final int value;
  final String unit;
  const _Chip({required this.value, required this.unit});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$value',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w700,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
          const SizedBox(width: 2),
          Text(unit, style: TextStyle(color: Colors.white.withValues(alpha: 0.55), fontSize: 11)),
        ],
      ),
    );
  }
}

class _TimeOrb extends StatelessWidget {
  final String time;
  final String emoji;
  const _TimeOrb({required this.time, required this.emoji});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 88,
      height: 88,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            AppColors.emerald500.withValues(alpha: 0.35),
            AppColors.emerald800.withValues(alpha: 0.12),
          ],
        ),
        border: Border.all(
          color: AppColors.emerald400.withValues(alpha: 0.30),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.emerald500.withValues(alpha: 0.20),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(height: 2),
          Text(
            time,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
        ],
      ),
    );
  }
}
