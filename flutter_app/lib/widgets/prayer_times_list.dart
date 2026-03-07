import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../models/prayer_times.dart';
import '../services/prayer_provider.dart';
import '../theme/app_theme.dart';
import '../utils/prayer_icons.dart';

class PrayerTimesList extends StatelessWidget {
  const PrayerTimesList({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final entries = provider.entries;

    if (entries.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: entries.asMap().entries.map((e) {
          return _PrayerItem(entry: e.value, index: e.key);
        }).toList(),
      ),
    );
  }
}

class _PrayerItem extends StatelessWidget {
  final PrayerEntry entry;
  final int index;

  const _PrayerItem({required this.entry, required this.index});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final meta = prayerMeta[entry.key] ?? prayerMeta['dhuhr']!;

    Color cardColor;
    Color textColor;
    Color subColor;
    Widget? statusBadge;
    bool isHighlighted = false;

    switch (entry.status) {
      case PrayerStatus.current:
        cardColor = AppColors.emerald600;
        textColor = Colors.white;
        subColor = AppColors.emerald100;
        isHighlighted = true;
        statusBadge = _StatusBadge(label: 'Aktual', color: Colors.white.withOpacity(0.25));
      case PrayerStatus.next:
        cardColor = AppColors.blue500;
        textColor = Colors.white;
        subColor = const Color(0xFFBFDBFE);
        isHighlighted = true;
        statusBadge = _StatusBadge(label: 'Tjetri', color: Colors.white.withOpacity(0.25));
      case PrayerStatus.past:
        cardColor = isDark ? AppColors.slate700 : AppColors.slate200;
        textColor = isDark ? AppColors.slate400 : AppColors.slate400;
        subColor = isDark ? AppColors.slate500 : AppColors.slate400;
      case PrayerStatus.upcoming:
        cardColor = isDark ? AppColors.slate800 : Colors.white;
        textColor = isDark ? Colors.white : AppColors.slate800;
        subColor = isDark ? AppColors.slate400 : AppColors.slate500;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: isHighlighted
            ? [
                BoxShadow(
                  color: cardColor.withOpacity(0.35),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Icon bubble
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: isHighlighted
                    ? LinearGradient(
                        colors: [
                          Colors.white.withOpacity(0.2),
                          Colors.white.withOpacity(0.1),
                        ],
                      )
                    : LinearGradient(colors: meta.gradient),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  meta.emoji,
                  style: const TextStyle(fontSize: 22),
                ),
              ),
            ),
            const SizedBox(width: 14),
            // Prayer name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.albanianName,
                    style: TextStyle(
                      color: textColor,
                      fontSize: entry.isSecondary ? 14 : 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    entry.name,
                    style: TextStyle(
                      color: subColor,
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
            // Status badge
            if (statusBadge != null) ...[statusBadge, const SizedBox(width: 10)],
            // Time
            Text(
              entry.time,
              style: TextStyle(
                color: entry.status == PrayerStatus.past ? subColor : textColor,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ],
        ),
      ),
    )
        .animate(delay: Duration(milliseconds: 60 * index))
        .fadeIn(duration: 300.ms)
        .slideX(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut);
  }
}

class _StatusBadge extends StatelessWidget {
  final String label;
  final Color color;

  const _StatusBadge({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
