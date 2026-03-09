import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import '../models/prayer_times.dart';
import '../services/prayer_provider.dart';
import '../theme/app_theme.dart';
import '../utils/prayer_icons.dart';

class PrayerTimesList extends StatelessWidget {
  const PrayerTimesList({super.key});

  @override
  Widget build(BuildContext context) {
    final entries = context.watch<PrayerProvider>().entries;
    if (entries.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: entries.asMap().entries.map((e) {
          return _PrayerCard(entry: e.value, index: e.key);
        }).toList(),
      ),
    );
  }
}

class _PrayerCard extends StatelessWidget {
  final PrayerEntry entry;
  final int index;
  const _PrayerCard({required this.entry, required this.index});

  @override
  Widget build(BuildContext context) {
    final meta = prayerMeta[entry.key] ?? prayerMeta['dhuhr']!;
    return _CardShell(entry: entry, meta: meta, index: index);
  }
}

class _CardShell extends StatelessWidget {
  final PrayerEntry entry;
  final PrayerMeta meta;
  final int index;

  const _CardShell({
    required this.entry,
    required this.meta,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final isCurrent   = entry.status == PrayerStatus.current;
    final isNext      = entry.status == PrayerStatus.next;
    final isPast      = entry.status == PrayerStatus.past;
    final isSecondary = entry.isSecondary;

    final Color borderColor;
    final List<Color> bgGradient;
    final double cardOpacity;

    if (isCurrent) {
      borderColor = AppColors.emerald400.withValues(alpha: 0.6);
      bgGradient  = [
        AppColors.emerald500.withValues(alpha: 0.22),
        AppColors.emerald800.withValues(alpha: 0.12),
      ];
      cardOpacity = 1.0;
    } else if (isNext) {
      borderColor = AppColors.blue400.withValues(alpha: 0.4);
      bgGradient  = [
        AppColors.blue400.withValues(alpha: 0.12),
        AppColors.blue400.withValues(alpha: 0.06),
      ];
      cardOpacity = 1.0;
    } else if (isPast) {
      borderColor = Colors.white.withValues(alpha: 0.05);
      bgGradient  = [
        Colors.white.withValues(alpha: 0.03),
        Colors.white.withValues(alpha: 0.02),
      ];
      cardOpacity = 0.55;
    } else {
      borderColor = Colors.white.withValues(alpha: 0.08);
      bgGradient  = [
        Colors.white.withValues(alpha: 0.06),
        Colors.white.withValues(alpha: 0.03),
      ];
      cardOpacity = 1.0;
    }

    return Opacity(
      opacity: cardOpacity,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: bgGradient,
                ),
                border: Border.all(color: borderColor, width: 1.0),
                boxShadow: isCurrent
                    ? [
                        BoxShadow(
                          color: AppColors.emerald500.withValues(alpha: 0.18),
                          blurRadius: 20,
                          offset: const Offset(0, 6),
                        ),
                      ]
                    : null,
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: isSecondary ? 11 : 14,
                ),
                child: Row(
                  children: [
                    _IconBubble(
                      meta: meta,
                      prayerKey: entry.key,
                      isCurrent: isCurrent,
                      isSecondary: isSecondary,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            entry.albanianName,
                            style: TextStyle(
                              color: isPast
                                  ? Colors.white.withValues(alpha: 0.45)
                                  : Colors.white,
                              fontSize: isSecondary ? 14 : 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            entry.name,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.35),
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isCurrent) const _Badge(label: 'AKTUAL', color: AppColors.emerald400),
                    if (isNext)    const _Badge(label: 'TJETRI', color: AppColors.blue400),
                    const SizedBox(width: 8),
                    Text(
                      entry.time,
                      style: TextStyle(
                        color: isPast
                            ? Colors.white.withValues(alpha: 0.35)
                            : isCurrent
                                ? AppColors.emerald300
                                : Colors.white,
                        fontSize: isSecondary ? 17 : 20,
                        fontWeight: FontWeight.w700,
                        fontFeatures: const [FontFeature.tabularFigures()],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    )
        .animate(delay: Duration(milliseconds: 50 * index))
        .fadeIn(duration: 350.ms)
        .slideX(begin: 0.04, end: 0, duration: 350.ms, curve: Curves.easeOut);
  }
}

class _IconBubble extends StatelessWidget {
  final PrayerMeta meta;
  final String prayerKey;
  final bool isCurrent;
  final bool isSecondary;

  const _IconBubble({
    required this.meta,
    required this.prayerKey,
    required this.isCurrent,
    required this.isSecondary,
  });

  @override
  Widget build(BuildContext context) {
    final size = isSecondary ? 38.0 : 44.0;
    final iconSize = isSecondary ? 17.0 : 21.0;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isCurrent
              ? [
                  AppColors.emerald400.withValues(alpha: 0.3),
                  AppColors.emerald600.withValues(alpha: 0.15),
                ]
              : meta.gradient.map((c) => c.withValues(alpha: 0.8)).toList(),
        ),
        border: Border.all(
          color: isCurrent
              ? AppColors.emerald400.withValues(alpha: 0.4)
              : Colors.white.withValues(alpha: 0.08),
        ),
      ),
      child: Center(
        child: PhosphorIcon(
          prayerIcon(prayerKey, fill: isCurrent),
          size: iconSize,
          color: isCurrent
              ? AppColors.emerald300
              : Colors.white.withValues(alpha: 0.85),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  const _Badge({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 6),
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.35)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 9,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}
