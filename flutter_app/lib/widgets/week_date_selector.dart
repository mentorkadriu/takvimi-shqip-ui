import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/prayer_provider.dart';
import '../theme/app_theme.dart';

class WeekDateSelector extends StatefulWidget {
  const WeekDateSelector({super.key});

  @override
  State<WeekDateSelector> createState() => _WeekDateSelectorState();
}

class _WeekDateSelectorState extends State<WeekDateSelector> {
  late ScrollController _sc;

  @override
  void initState() {
    super.initState();
    _sc = ScrollController();
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToSelected());
  }

  void _scrollToSelected() {
    const itemW = 62.0;
    const startOffset = 3;
    _sc.animateTo(
      startOffset * itemW,
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _sc.dispose();
    super.dispose();
  }

  bool _same(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final today = DateTime.now();
    final start = today.subtract(const Duration(days: 3));
    final days = List.generate(14, (i) => start.add(Duration(days: i)));

    return SizedBox(
      height: 82,
      child: ListView.builder(
        controller: _sc,
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: days.length,
        itemBuilder: (context, i) {
          final day = days[i];
          final isSelected = _same(day, provider.selectedDate);
          final isToday = _same(day, today);
          return _DayPill(
            day: day,
            isSelected: isSelected,
            isToday: isToday,
            onTap: () => provider.selectDate(day),
          );
        },
      ),
    );
  }
}

class _DayPill extends StatelessWidget {
  final DateTime day;
  final bool isSelected;
  final bool isToday;
  final VoidCallback onTap;

  const _DayPill({
    required this.day,
    required this.isSelected,
    required this.isToday,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final dayLetter = DateFormat('E').format(day).substring(0, 2).toUpperCase();

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
        width: 52,
        margin: const EdgeInsets.only(right: 10, top: 4, bottom: 4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: isSelected
              ? const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppColors.emerald400, AppColors.emerald600],
                )
              : null,
          color: isSelected ? null : Colors.white.withValues(alpha: 0.06),
          border: Border.all(
            color: isSelected
                ? AppColors.emerald300.withValues(alpha: 0.5)
                : isToday
                    ? AppColors.emerald400.withValues(alpha: 0.5)
                    : Colors.white.withValues(alpha: 0.08),
            width: 1.5,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.emerald500.withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              dayLetter,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: isSelected
                    ? Colors.black.withValues(alpha: 0.7)
                    : Colors.white.withValues(alpha: 0.5),
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              '${day.day}',
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w700,
                color: isSelected ? Colors.black : Colors.white,
              ),
            ),
            if (isToday && !isSelected)
              Container(
                width: 4,
                height: 4,
                margin: const EdgeInsets.only(top: 3),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.emerald400,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
