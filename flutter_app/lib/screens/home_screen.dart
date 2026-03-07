import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/prayer_provider.dart';
import '../services/prayer_times_service.dart';
import '../services/hijri_service.dart';
import '../theme/app_theme.dart';
import '../widgets/week_date_selector.dart';
import '../widgets/next_prayer_card.dart';
import '../widgets/prayer_times_list.dart';
import '../widgets/city_selector_sheet.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: RefreshIndicator(
        onRefresh: () async {
          final provider = context.read<PrayerProvider>();
          await provider.init();
        },
        color: AppColors.emerald500,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            _HomeHeader(),
            const SliverToBoxAdapter(child: SizedBox(height: 8)),
            SliverToBoxAdapter(child: _DateInfoRow()),
            const SliverToBoxAdapter(child: SizedBox(height: 8)),
            const SliverToBoxAdapter(child: WeekDateSelector()),
            const SliverToBoxAdapter(child: SizedBox(height: 12)),
            const SliverToBoxAdapter(child: NextPrayerCard()),
            const SliverToBoxAdapter(child: PrayerTimesList()),
            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final today = DateTime.now();
    final dayName = DateFormat('EEEE', 'sq').format(today);
    final dateStr = DateFormat('d MMMM yyyy', 'sq').format(today);

    return SliverAppBar(
      expandedHeight: 170,
      pinned: true,
      stretch: true,
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.pin,
        stretchModes: const [StretchMode.blurBackground],
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF064E3B),
                Color(0xFF065F46),
                Color(0xFF047857),
              ],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // App branding
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Takvimi Shqip',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.3,
                            ),
                          ),
                          Text(
                            '☪  Vaktet e Namazit',
                            style: TextStyle(
                              color: AppColors.emerald200,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      // City button
                      _CityButton(cityName: provider.selectedCity),
                    ],
                  ).animate().fadeIn(duration: 400.ms),

                  const SizedBox(height: 12),

                  // Date row
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined,
                          color: AppColors.emerald300, size: 14),
                      const SizedBox(width: 6),
                      Text(
                        '$dayName, $dateStr',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ).animate(delay: 100.ms).fadeIn(duration: 400.ms),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CityButton extends StatelessWidget {
  final String cityName;

  const _CityButton({required this.cityName});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => CitySelectorSheet.show(context),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.location_on_rounded, color: AppColors.emerald300, size: 16),
            const SizedBox(width: 4),
            Text(
              cityName,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.expand_more, color: Colors.white70, size: 16),
          ],
        ),
      ),
    );
  }
}

class _DateInfoRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final day = provider.prayerDay;
    final selectedDate = provider.selectedDate;
    final hijriStr = HijriService.toHijriString(selectedDate);
    final monthName = PrayerTimesService.albanianMonth(selectedDate.month);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _InfoChip(
              icon: Icons.brightness_5_rounded,
              label: 'Dita zgjat',
              value: day?.dayLength ?? '--:--',
              isDark: isDark,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _InfoChip(
              icon: Icons.star_rounded,
              label: 'Kalendari Hixhri',
              value: hijriStr,
              isDark: isDark,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isDark;

  const _InfoChip({
    required this.icon,
    required this.label,
    required this.value,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? AppColors.slate800 : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.emerald600, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: AppColors.slate400,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    color: isDark ? Colors.white : AppColors.slate800,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
