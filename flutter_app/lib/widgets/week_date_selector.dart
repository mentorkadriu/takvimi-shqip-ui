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
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToToday());
  }

  void _scrollToToday() {
    final today = DateTime.now();
    final start = today.subtract(const Duration(days: 3));
    final diff = today.difference(start).inDays;
    _scrollController.animateTo(
      diff * 62.0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final today = DateTime.now();
    final start = today.subtract(const Duration(days: 3));
    final days = List.generate(14, (i) => start.add(Duration(days: i)));

    return SizedBox(
      height: 76,
      child: ListView.builder(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: days.length,
        itemBuilder: (context, index) {
          final day = days[index];
          final isSelected = isSameDay(day, provider.selectedDate);
          final isToday = isSameDay(day, today);
          return _DayChip(
            day: day,
            isSelected: isSelected,
            isToday: isToday,
            onTap: () => provider.selectDate(day),
          );
        },
      ),
    );
  }

  bool isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;
}

class _DayChip extends StatelessWidget {
  final DateTime day;
  final bool isSelected;
  final bool isToday;
  final VoidCallback onTap;

  const _DayChip({
    required this.day,
    required this.isSelected,
    required this.isToday,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final dayLetter = DateFormat('E').format(day).substring(0, 1).toUpperCase();
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 52,
        margin: const EdgeInsets.only(right: 8, top: 4, bottom: 4),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.emerald600
              : isToday
                  ? AppColors.emerald600.withOpacity(0.15)
                  : Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(14),
          border: isToday && !isSelected
              ? Border.all(color: AppColors.emerald400, width: 1.5)
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              dayLetter,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.7),
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${day.day}',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
