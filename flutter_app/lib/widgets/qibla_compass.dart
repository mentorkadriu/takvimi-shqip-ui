import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:sensors_plus/sensors_plus.dart';
import '../services/qibla_service.dart';
import '../theme/app_theme.dart';

class QiblaCompass extends StatefulWidget {
  const QiblaCompass({super.key});

  @override
  State<QiblaCompass> createState() => _QiblaCompassState();
}

class _QiblaCompassState extends State<QiblaCompass>
    with SingleTickerProviderStateMixin {
  double? _qiblaAngle;
  double  _compassHeading = 0;
  StreamSubscription<MagnetometerEvent>? _magnetometerSub;
  late AnimationController _animController;
  late Animation<double>   _rotationAnim;
  bool   _isLoading = true;
  String? _error;
  double? _userLat;
  double? _userLon;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );
    _rotationAnim = const AlwaysStoppedAnimation(0);
    _init();
  }

  Future<void> _init() async {
    await _getLocation();
    if (_userLat != null) _startCompass();
  }

  Future<void> _getLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => _error = 'Shërbimi i lokacionit është i çaktivizuar.');
        return;
      }
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
        if (perm == LocationPermission.denied) {
          setState(() => _error = 'Leja e lokacionit u refuzua.');
          return;
        }
      }
      if (perm == LocationPermission.deniedForever) {
        setState(() => _error = 'Leja e lokacionit është refuzuar përgjithmonë.');
        return;
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium),
      );
      setState(() {
        _userLat   = pos.latitude;
        _userLon   = pos.longitude;
        _qiblaAngle = QiblaService.calculateQibla(pos.latitude, pos.longitude);
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _userLat   = 42.5;
        _userLon   = 21.0;
        _qiblaAngle = QiblaService.calculateQibla(42.5, 21.0);
        _isLoading = false;
      });
    }
  }

  void _startCompass() {
    _magnetometerSub = magnetometerEventStream().listen((e) {
      final heading = (math.atan2(e.y, e.x) * 180 / math.pi + 360) % 360;
      if (!mounted) return;
      setState(() => _compassHeading = heading);
      _animate();
    });
  }

  void _animate() {
    if (_qiblaAngle == null) return;
    final target = (_qiblaAngle! - _compassHeading) * math.pi / 180;
    _rotationAnim = Tween<double>(
      begin: _rotationAnim.value,
      end: target,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward(from: 0);
  }

  @override
  void dispose() {
    _magnetometerSub?.cancel();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const _CompassLoading();
    if (_error != null) return _CompassError(error: _error!, onRetry: () {
      setState(() { _error = null; _isLoading = true; });
      _init();
    });

    final qibla = _qiblaAngle ?? 0.0;

    return Column(
      children: [
        // ── Coordinates pill ────────────────────────────────────────────
        if (_userLat != null)
          _GlassPill(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.my_location, color: AppColors.emerald400, size: 13),
                const SizedBox(width: 6),
                Text(
                  '${_userLat!.toStringAsFixed(4)}°N   ${_userLon!.toStringAsFixed(4)}°E',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),

        const SizedBox(height: 36),

        // ── Compass dial ─────────────────────────────────────────────────
        SizedBox(
          width: 300,
          height: 300,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Outer glow ring
              Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.emerald600.withValues(alpha: 0.15),
                      blurRadius: 40,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
              // Dial background
              ClipOval(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                  child: Container(
                    width: 300,
                    height: 300,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          AppColors.darkLayer.withValues(alpha: 0.85),
                          AppColors.darkBg.withValues(alpha: 0.95),
                        ],
                      ),
                      border: Border.all(
                        color: AppColors.emerald700.withValues(alpha: 0.5),
                        width: 1.5,
                      ),
                    ),
                  ),
                ),
              ),
              // Tick ring
              CustomPaint(
                size: const Size(270, 270),
                painter: _TickPainter(),
              ),
              // Cardinal labels
              ..._cardinalLabels(),
              // Animated needle
              AnimatedBuilder(
                animation: _animController,
                builder: (_, __) => Transform.rotate(
                  angle: _rotationAnim.value,
                  child: const _Needle(),
                ),
              ),
              // Center jewel
              _CenterJewel(),
            ],
          ),
        ),

        const SizedBox(height: 36),

        // ── Bearing info ─────────────────────────────────────────────────
        _GlassPill(
          child: Column(
            children: [
              const Text(
                '🕋  DREJTIMI I KIBLES',
                style: TextStyle(
                  color: AppColors.emerald300,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '${qibla.toStringAsFixed(1)}°',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(
                'nga Veriu (orë)',
                style: TextStyle(color: Colors.white.withValues(alpha: 0.45), fontSize: 12),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        ),
      ],
    );
  }

  List<Widget> _cardinalLabels() {
    const dirs = [
      ('V', 0.0, true),
      ('L', 90.0, false),
      ('J', 180.0, false),
      ('P', 270.0, false),
    ];
    const r = 118.0;
    return dirs.map((d) {
      final angle = d.$2 * math.pi / 180;
      return Transform.translate(
        offset: Offset(r * math.sin(angle), -r * math.cos(angle)),
        child: Text(
          d.$1,
          style: TextStyle(
            color: d.$3 ? AppColors.emerald400 : Colors.white.withValues(alpha: 0.5),
            fontSize: d.$3 ? 18 : 14,
            fontWeight: d.$3 ? FontWeight.w800 : FontWeight.w600,
          ),
        ),
      );
    }).toList();
  }
}

// ─── Needle ───────────────────────────────────────────────────────────────────
class _Needle extends StatelessWidget {
  const _Needle();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      height: 160,
      child: CustomPaint(painter: _NeedlePainter()),
    );
  }
}

class _NeedlePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final h  = size.height / 2;

    // North (to Kaaba) — emerald with glow
    final northPath = Path()
      ..moveTo(cx, cy - h + 10)
      ..lineTo(cx - 7, cy + 6)
      ..lineTo(cx, cy + 2)
      ..lineTo(cx + 7, cy + 6)
      ..close();

    // South — muted
    final southPath = Path()
      ..moveTo(cx, cy + h - 10)
      ..lineTo(cx - 7, cy - 6)
      ..lineTo(cx, cy - 2)
      ..lineTo(cx + 7, cy - 6)
      ..close();

    canvas.drawPath(southPath, Paint()..color = const Color(0xFF2A4A5A));

    // Glow
    canvas.drawPath(northPath, Paint()
      ..color = AppColors.emerald400.withValues(alpha: 0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10));

    canvas.drawPath(northPath, Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [AppColors.emerald300, AppColors.emerald600],
      ).createShader(Rect.fromLTWH(cx - 8, cy - h + 10, 16, h + 4)));
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}

// ─── Tick marks ───────────────────────────────────────────────────────────────
class _TickPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final r  = size.width / 2;

    for (int i = 0; i < 72; i++) {
      final angle  = i * (2 * math.pi / 72);
      final isMajor = i % 9 == 0;
      final len    = isMajor ? 10.0 : 5.0;
      final paint  = Paint()
        ..color = isMajor
            ? Colors.white.withValues(alpha: 0.35)
            : Colors.white.withValues(alpha: 0.10)
        ..strokeWidth = isMajor ? 1.5 : 0.8
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(
        Offset(cx + (r - len) * math.sin(angle), cy - (r - len) * math.cos(angle)),
        Offset(cx + r * math.sin(angle), cy - r * math.cos(angle)),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}

// ─── Center jewel ─────────────────────────────────────────────────────────────
class _CenterJewel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 18,
      height: 18,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.darkBg,
        border: Border.all(color: AppColors.emerald400, width: 2),
        boxShadow: [
          BoxShadow(
            color: AppColors.emerald400.withValues(alpha: 0.5),
            blurRadius: 8,
            spreadRadius: 1,
          ),
        ],
      ),
    );
  }
}

// ─── Glass pill container ─────────────────────────────────────────────────────
class _GlassPill extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const _GlassPill({
    required this.child,
    this.padding = const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.07),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
          ),
          child: child,
        ),
      ),
    );
  }
}

// ─── Loading / error states ───────────────────────────────────────────────────
class _CompassLoading extends StatelessWidget {
  const _CompassLoading();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(
          width: 48,
          height: 48,
          child: CircularProgressIndicator(
            color: AppColors.emerald400,
            strokeWidth: 2,
          ),
        ),
        const SizedBox(height: 16),
        Text('Duke gjetur lokacionin...',
            style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 14)),
      ],
    );
  }
}

class _CompassError extends StatelessWidget {
  final String error;
  final VoidCallback onRetry;
  const _CompassError({required this.error, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.location_off_rounded, color: AppColors.amber400, size: 48),
          const SizedBox(height: 16),
          Text(error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white.withValues(alpha: 0.65), fontSize: 14)),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Provo Sërish'),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.emerald600,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}
