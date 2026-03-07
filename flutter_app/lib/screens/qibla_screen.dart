import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../widgets/qibla_compass.dart';

class QiblaScreen extends StatelessWidget {
  const QiblaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ── Background ───────────────────────────────────────────────────
        Container(decoration: const BoxDecoration(gradient: appGradient)),
        // Star speckles
        const Positioned.fill(child: _Stars()),
        // Bottom aurora
        Positioned(
          bottom: -60,
          left: 0,
          right: 0,
          child: Container(
            height: 220,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.bottomCenter,
                radius: 1.2,
                colors: [
                  AppColors.emerald700.withValues(alpha: 0.25),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),

        // ── Content ──────────────────────────────────────────────────────
        SafeArea(
          child: Column(
            children: [
              _AppBar(),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Column(
                    children: [
                      _InfoBanner()
                          .animate(delay: 200.ms)
                          .fadeIn(duration: 400.ms)
                          .slideY(begin: 0.1),
                      const SizedBox(height: 24),
                      const QiblaCompass(),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AppBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Kibla',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(
                'Drejtimi i Qabes së Shenjtë',
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
            child: const Center(
              child: Text('🕋', style: TextStyle(fontSize: 20)),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms);
  }
}

class _InfoBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.emerald900.withValues(alpha: 0.35),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.emerald700.withValues(alpha: 0.4)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: AppColors.emerald400.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.compass_calibration_rounded,
                    color: AppColors.emerald400, size: 18),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Kalibroni busullën duke lëvizur telefonin në formë të numrit 8 disa herë.',
                  style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Decorative star field ────────────────────────────────────────────────────
class _Stars extends StatelessWidget {
  const _Stars();

  static const _pos = [
    (0.08, 0.04), (0.92, 0.06), (0.45, 0.10), (0.75, 0.02),
    (0.18, 0.15), (0.88, 0.18), (0.55, 0.22), (0.03, 0.28),
    (0.78, 0.30), (0.12, 0.38), (0.95, 0.42), (0.38, 0.48),
    (0.65, 0.08), (0.25, 0.55), (0.82, 0.60), (0.50, 0.65),
  ];

  @override
  Widget build(BuildContext context) => CustomPaint(painter: _StarPainter());
}

class _StarPainter extends CustomPainter {
  static const _pos = _Stars._pos;

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < _pos.length; i++) {
      final alpha = i.isEven ? 0.4 : 0.2;
      final r = i % 3 == 0 ? 1.8 : 1.0;
      canvas.drawCircle(
        Offset(_pos[i].$1 * size.width, _pos[i].$2 * size.height),
        r,
        Paint()..color = Colors.white.withValues(alpha: alpha),
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}
