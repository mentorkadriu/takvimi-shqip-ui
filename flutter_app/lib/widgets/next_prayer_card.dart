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
    final next = provider.nextPrayer;
    final current = provider.currentPrayer;
    final remaining = provider.timeUntilNext;

    if (next == null && current == null) return const SizedBox.shrink();

    final hours = remaining.inHours;
    final minutes = remaining.inMinutes % 60;
    final meta = prayerMeta[next?.key ?? current?.key] ??
        prayerMeta['isha']!;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.emerald700,
            AppColors.emerald800,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.emerald900.withOpacity(0.4),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            // Prayer info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    current != null ? 'Namazi Aktual' : 'Namazi i Radhës',
                    style: TextStyle(
                      color: AppColors.emerald100.withOpacity(0.8),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    next?.albanianName ?? current?.albanianName ?? '',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (next != null && remaining > Duration.zero)
                    _CountdownRow(hours: hours, minutes: minutes),
                ],
              ),
            ),
            // Time bubble
            _TimeBubble(time: next?.time ?? current?.time ?? '', emoji: meta.emoji),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(duration: 400.ms)
        .slideY(begin: 0.1, end: 0, duration: 400.ms, curve: Curves.easeOut);
  }
}

class _CountdownRow extends StatelessWidget {
  final int hours;
  final int minutes;

  const _CountdownRow({required this.hours, required this.minutes});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.access_time_rounded, color: AppColors.emerald300, size: 14),
        const SizedBox(width: 4),
        RichText(
          text: TextSpan(
            style: const TextStyle(color: AppColors.emerald100, fontSize: 13),
            children: [
              const TextSpan(text: 'Mbetet '),
              if (hours > 0)
                TextSpan(
                  text: '${hours}h ',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.white),
                ),
              TextSpan(
                text: '${minutes}min',
                style: const TextStyle(
                  fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _TimeBubble extends StatelessWidget {
  final String time;
  final String emoji;

  const _TimeBubble({required this.time, required this.emoji});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 22)),
          const SizedBox(height: 4),
          Text(
            time,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
        ],
      ),
    );
  }
}
