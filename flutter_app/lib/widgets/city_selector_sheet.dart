import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/prayer_times.dart';
import '../services/prayer_provider.dart';
import '../theme/app_theme.dart';

class CitySelectorSheet extends StatelessWidget {
  const CitySelectorSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const CitySelectorSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PrayerProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final screenH = MediaQuery.of(context).size.height;

    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: screenH * 0.75),
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.slate800 : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.slate300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Title
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  const Icon(Icons.location_city_rounded, color: AppColors.emerald600),
                  const SizedBox(width: 10),
                  Text(
                    'Zgjedh Qytetin',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                ],
              ),
            ),
            const Divider(),
            // City grid — scrollable so it never overflows
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
                child: GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 2.8,
                  children: kosovarCities.map((city) {
                final isSelected = city.name == provider.selectedCity;
                return InkWell(
                  onTap: () {
                    provider.selectCity(city.name);
                    Navigator.pop(context);
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.emerald600
                          : isDark
                              ? AppColors.slate700
                              : AppColors.slate100,
                      borderRadius: BorderRadius.circular(12),
                      border: isSelected
                          ? null
                          : Border.all(color: AppColors.slate200, width: 1),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (isSelected) ...[
                          const Icon(Icons.check_circle, color: Colors.white, size: 16),
                          const SizedBox(width: 6),
                        ],
                        Text(
                          city.name,
                          style: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : isDark ? Colors.white : AppColors.slate700,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            fontSize: 14,
                          ),
                        ),
                        if (city.offsetMinutes != 0)
                          Text(
                            ' (${city.offsetMinutes > 0 ? '+' : ''}${city.offsetMinutes})',
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white70
                                  : AppColors.slate400,
                              fontSize: 11,
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              }).toList(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
