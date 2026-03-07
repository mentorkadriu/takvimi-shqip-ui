import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import '../services/settings_provider.dart';
import '../theme/app_theme.dart';
import '../utils/prayer_icons.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ── Background ────────────────────────────────────────────────────
        Container(decoration: const BoxDecoration(gradient: appGradient)),
        // Aurora blobs
        Positioned(
          top: -80,
          right: -60,
          child: Container(
            width: 280,
            height: 280,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(colors: [
                AppColors.emerald700.withValues(alpha: 0.18),
                Colors.transparent,
              ]),
            ),
          ),
        ),
        Positioned(
          bottom: -40,
          left: -40,
          child: Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(colors: [
                AppColors.emerald800.withValues(alpha: 0.14),
                Colors.transparent,
              ]),
            ),
          ),
        ),

        // ── Content ───────────────────────────────────────────────────────
        SafeArea(
          child: Column(
            children: [
              _AppBar(),
              const Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(20, 4, 20, 100),
                  child: _SettingsBody(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ─── App bar ─────────────────────────────────────────────────────────────────

class _AppBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Cilësimet',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(
                'Njoftimet dhe preferencat',
                style: TextStyle(
                  color: AppColors.emerald300.withValues(alpha: 0.75),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const Spacer(),
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.emerald600.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.emerald500.withValues(alpha: 0.3)),
            ),
            child: Center(
              child: PhosphorIcon(
                PhosphorIcons.gear(PhosphorIconsStyle.fill),
                color: AppColors.emerald400,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms);
  }
}

// ─── Body ─────────────────────────────────────────────────────────────────────

class _SettingsBody extends StatelessWidget {
  const _SettingsBody();

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SettingsProvider>();
    final s  = sp.settings;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Notifications master ───────────────────────────────────────────
        const _SectionHeader(label: 'Njoftimet'),
        _GlassCard(
          child: Column(
            children: [
              _ToggleRow(
                icon: s.masterEnabled
                    ? PhosphorIcons.bell(PhosphorIconsStyle.fill)
                    : PhosphorIcons.bellSlash(),
                iconColor: s.masterEnabled
                    ? AppColors.emerald400
                    : Colors.white.withValues(alpha: 0.4),
                title: 'Aktivizo njoftimet',
                subtitle: s.masterEnabled ? 'Aktive' : 'Joaktive',
                value: s.masterEnabled,
                onChanged: (v) => sp.setMasterEnabled(v),
              ),

              // ── Expanded options when enabled ────────────────────────────
              AnimatedCrossFade(
                firstChild: const SizedBox.shrink(),
                secondChild: Column(
                  children: [
                    _Divider(),
                    _ToggleRow(
                      icon: s.soundEnabled
                          ? PhosphorIcons.speakerHigh(PhosphorIconsStyle.fill)
                          : PhosphorIcons.speakerSlash(),
                      iconColor: s.soundEnabled
                          ? AppColors.emerald400
                          : Colors.white.withValues(alpha: 0.4),
                      title: 'Toni i njoftimit',
                      subtitle: s.soundEnabled ? 'Me tingull' : 'Pa tingull',
                      value: s.soundEnabled,
                      onChanged: (v) => sp.setSoundEnabled(v),
                    ),
                    _Divider(),
                    _AdvanceRow(
                      currentMinutes: s.advanceMinutes,
                      onChanged: (v) => sp.setAdvanceMinutes(v),
                    ),
                  ],
                ),
                crossFadeState: s.masterEnabled
                    ? CrossFadeState.showSecond
                    : CrossFadeState.showFirst,
                duration: const Duration(milliseconds: 300),
              ),
            ],
          ),
        ),

        // ── Per-prayer toggles ─────────────────────────────────────────────
        AnimatedCrossFade(
          firstChild: const SizedBox.shrink(),
          secondChild: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _SectionHeader(label: 'Vaktet'),
              _GlassCard(
                child: Column(
                  children: [
                    _PrayerToggle(
                      prayerKey: 'imsak',
                      label: 'Imsaku',
                      value: s.prayers['imsak'] ?? false,
                      onChanged: (v) => sp.setPrayerEnabled('imsak', v),
                      isLast: false,
                    ),
                    _PrayerToggle(
                      prayerKey: 'fajr',
                      label: 'Sabahu',
                      value: s.prayers['fajr'] ?? true,
                      onChanged: (v) => sp.setPrayerEnabled('fajr', v),
                      isLast: false,
                    ),
                    _PrayerToggle(
                      prayerKey: 'dhuhr',
                      label: 'Dreka',
                      value: s.prayers['dhuhr'] ?? true,
                      onChanged: (v) => sp.setPrayerEnabled('dhuhr', v),
                      isLast: false,
                    ),
                    _PrayerToggle(
                      prayerKey: 'asr',
                      label: 'Ikindia',
                      value: s.prayers['asr'] ?? true,
                      onChanged: (v) => sp.setPrayerEnabled('asr', v),
                      isLast: false,
                    ),
                    _PrayerToggle(
                      prayerKey: 'maghrib',
                      label: 'Akshami',
                      value: s.prayers['maghrib'] ?? true,
                      onChanged: (v) => sp.setPrayerEnabled('maghrib', v),
                      isLast: false,
                    ),
                    _PrayerToggle(
                      prayerKey: 'isha',
                      label: 'Jacia',
                      value: s.prayers['isha'] ?? true,
                      onChanged: (v) => sp.setPrayerEnabled('isha', v),
                      isLast: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
          crossFadeState: s.masterEnabled
              ? CrossFadeState.showSecond
              : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 300),
        ),

        // ── About ──────────────────────────────────────────────────────────
        const _SectionHeader(label: 'Rreth aplikacionit'),
        _GlassCard(
          child: Column(
            children: [
              _InfoRow(
                icon: PhosphorIcons.info(PhosphorIconsStyle.fill),
                title: 'Versioni',
                value: '2.0.0',
              ),
              _Divider(),
              _InfoRow(
                icon: PhosphorIcons.mosque(PhosphorIconsStyle.fill),
                title: 'Burimi i të dhënave',
                value: 'BIK Kosovo 2026',
              ),
              _Divider(),
              _InfoRow(
                icon: PhosphorIcons.mapPin(PhosphorIconsStyle.fill),
                title: 'Zona kohore',
                value: 'Europe/Belgrade (CET/CEST)',
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),
      ],
    ).animate().fadeIn(duration: 450.ms, delay: 100.ms).slideY(begin: 0.06);
  }
}

// ─── Section header ───────────────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 20, 0, 8),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: AppColors.emerald400.withValues(alpha: 0.7),
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.5,
        ),
      ),
    );
  }
}

// ─── Glass card wrapper ───────────────────────────────────────────────────────

class _GlassCard extends StatelessWidget {
  final Widget child;
  const _GlassCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withValues(alpha: 0.10)),
          ),
          child: child,
        ),
      ),
    );
  }
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

class _ToggleRow extends StatelessWidget {
  final PhosphorIconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ToggleRow({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: PhosphorIcon(icon, size: 18, color: iconColor),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600)),
                Text(subtitle,
                    style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.45),
                        fontSize: 12)),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: AppColors.emerald400,
            activeTrackColor: AppColors.emerald700.withValues(alpha: 0.5),
            inactiveThumbColor: Colors.white.withValues(alpha: 0.35),
            inactiveTrackColor: Colors.white.withValues(alpha: 0.1),
            trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
          ),
        ],
      ),
    );
  }
}

// ─── Advance notice row ───────────────────────────────────────────────────────

class _AdvanceRow extends StatelessWidget {
  final int currentMinutes;
  final ValueChanged<int> onChanged;

  const _AdvanceRow({
    required this.currentMinutes,
    required this.onChanged,
  });

  static const _options = [0, 5, 10, 15];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: AppColors.emerald400.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: PhosphorIcon(
                    PhosphorIcons.timer(PhosphorIconsStyle.fill),
                    size: 18,
                    color: AppColors.emerald400,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Text(
                  'Njoftim paraprak',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: _options.map((mins) {
              final selected = currentMinutes == mins;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onChanged(mins),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    padding: const EdgeInsets.symmetric(vertical: 9),
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.emerald500.withValues(alpha: 0.3)
                          : Colors.white.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: selected
                            ? AppColors.emerald400.withValues(alpha: 0.5)
                            : Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Text(
                      mins == 0 ? 'Tani' : '${mins}m',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: selected
                            ? AppColors.emerald300
                            : Colors.white.withValues(alpha: 0.5),
                        fontSize: 13,
                        fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

// ─── Per-prayer toggle ────────────────────────────────────────────────────────

class _PrayerToggle extends StatelessWidget {
  final String prayerKey;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;
  final bool isLast;

  const _PrayerToggle({
    required this.prayerKey,
    required this.label,
    required this.value,
    required this.onChanged,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    final meta = prayerMeta[prayerKey] ?? prayerMeta['dhuhr']!;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: value
                        ? meta.gradient.map((c) => c.withValues(alpha: 0.85)).toList()
                        : [
                            Colors.white.withValues(alpha: 0.04),
                            Colors.white.withValues(alpha: 0.04),
                          ],
                  ),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: value
                        ? Colors.white.withValues(alpha: 0.12)
                        : Colors.white.withValues(alpha: 0.06),
                  ),
                ),
                child: Center(
                  child: PhosphorIcon(
                    prayerIcon(prayerKey, fill: value),
                    size: 17,
                    color: value
                        ? Colors.white.withValues(alpha: 0.9)
                        : Colors.white.withValues(alpha: 0.3),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    color: value ? Colors.white : Colors.white.withValues(alpha: 0.45),
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Switch(
                value: value,
                onChanged: onChanged,
                activeThumbColor: AppColors.emerald400,
                activeTrackColor: AppColors.emerald700.withValues(alpha: 0.5),
                inactiveThumbColor: Colors.white.withValues(alpha: 0.35),
                inactiveTrackColor: Colors.white.withValues(alpha: 0.1),
                trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
              ),
            ],
          ),
        ),
        if (!isLast) _Divider(),
      ],
    );
  }
}

// ─── Info row ─────────────────────────────────────────────────────────────────

class _InfoRow extends StatelessWidget {
  final PhosphorIconData icon;
  final String title;
  final String value;

  const _InfoRow({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          PhosphorIcon(
            icon,
            size: 16,
            color: AppColors.emerald400.withValues(alpha: 0.7),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.6),
              fontSize: 14,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Thin divider ─────────────────────────────────────────────────────────────

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 0.5,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      color: Colors.white.withValues(alpha: 0.08),
    );
  }
}
