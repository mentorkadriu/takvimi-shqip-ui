import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../services/prayer_provider.dart';
import '../services/hijri_service.dart';
import '../theme/app_theme.dart';
import '../widgets/week_date_selector.dart';
import '../widgets/next_prayer_card.dart';
import '../widgets/prayer_times_list.dart';
import '../widgets/city_selector_sheet.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();

    return Stack(
      children: [
        // ── Layered background ─────────────────────────────────────────────
        const Positioned.fill(child: _AppBackground()),

        // ── Content ───────────────────────────────────────────────────────
        RefreshIndicator(
          onRefresh: () async => context.read<PrayerProvider>().init(),
          color: AppColors.emerald400,
          backgroundColor: AppColors.darkCard,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: SafeArea(
                  bottom: false,
                  child: _Header(),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 4)),
              const SliverToBoxAdapter(child: WeekDateSelector()),
              const SliverToBoxAdapter(child: SizedBox(height: 8)),
              SliverToBoxAdapter(child: _InfoRow()),
              const SliverToBoxAdapter(child: SizedBox(height: 16)),
              if (provider.isLoading)
                const SliverToBoxAdapter(child: _LoadingSkeleton())
              else ...[
                const SliverToBoxAdapter(child: NextPrayerCard()),
                const SliverToBoxAdapter(child: PrayerTimesList()),
              ],
              const SliverToBoxAdapter(child: SizedBox(height: 110)),
            ],
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Background — layered gradient + aurora glow blobs
// ─────────────────────────────────────────────────────────────────────────────
class _AppBackground extends StatelessWidget {
  const _AppBackground();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: appGradient),
      child: Stack(
        children: [
          // Top-left teal aurora
          Positioned(
            top: -80,
            left: -60,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.emerald600.withValues(alpha: 0.22),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          // Bottom-right teal aurora
          Positioned(
            bottom: 120,
            right: -40,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.emerald500.withValues(alpha: 0.14),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────
class _Header extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final now = DateTime.now();
    final dayName  = DateFormat('EEEE', 'sq').format(now);
    final dateStr  = DateFormat('d MMMM', 'sq').format(now);
    final yearStr  = DateFormat('yyyy').format(now);
    final hijriStr = HijriService.toHijriString(now);

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Top bar ──────────────────────────────────────────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Brand
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text('☪', style: TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Text(
                        'Takvimi Shqip',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                            ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    hijriStr,
                    style: TextStyle(
                      color: AppColors.emerald300.withValues(alpha: 0.8),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              // City selector
              _CityButton(city: provider.selectedCity),
            ],
          ).animate().fadeIn(duration: 500.ms),

          const SizedBox(height: 20),

          // ── Date display ─────────────────────────────────────────────────
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                dayName.toUpperCase(),
                style: TextStyle(
                  color: AppColors.emerald400.withValues(alpha: 0.8),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2.5,
                ),
              ),
              const SizedBox(height: 2),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: dateStr,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 34,
                        fontWeight: FontWeight.w800,
                        height: 1.1,
                      ),
                    ),
                    TextSpan(
                      text: '  $yearStr',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.35),
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ).animate(delay: 100.ms).fadeIn(duration: 500.ms).slideY(begin: 0.1),
        ],
      ),
    );
  }
}

class _CityButton extends StatelessWidget {
  final String city;
  const _CityButton({required this.city});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => CitySelectorSheet.show(context),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.location_on, color: AppColors.emerald400, size: 14),
                const SizedBox(width: 5),
                Text(
                  city,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(Icons.keyboard_arrow_down_rounded,
                    color: Colors.white.withValues(alpha: 0.5), size: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Info row — day length chip
// ─────────────────────────────────────────────────────────────────────────────
class _InfoRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final day = context.watch<PrayerProvider>().prayerDay;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          _InfoChip(
            icon: Icons.wb_sunny_outlined,
            label: 'Dita zgjat',
            value: day?.dayLength ?? '--:--',
          ),
          const SizedBox(width: 10),
          _InfoChip(
            icon: Icons.auto_awesome,
            label: 'Dita javore',
            value: _albanianWeekday(DateTime.now().weekday),
          ),
        ],
      ),
    );
  }

  String _albanianWeekday(int wd) {
    const days = ['E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë', 'E Diel'];
    return days[(wd - 1).clamp(0, 6)];
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoChip({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              children: [
                Icon(icon, color: AppColors.emerald400, size: 16),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label,
                        style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.45),
                            fontSize: 10,
                            fontWeight: FontWeight.w500)),
                    Text(value,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shimmer loading skeleton
// ─────────────────────────────────────────────────────────────────────────────
class _LoadingSkeleton extends StatelessWidget {
  const _LoadingSkeleton();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.white.withValues(alpha: 0.05),
      highlightColor: Colors.white.withValues(alpha: 0.12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: List.generate(7, (i) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              height: 68,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
              ),
            );
          }),
        ),
      ),
    );
  }
}
