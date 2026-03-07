import 'dart:async';
import 'dart:math' as math;
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
  double _compassHeading = 0;
  StreamSubscription<MagnetometerEvent>? _magnetometerSub;
  late AnimationController _animController;
  late Animation<double> _rotationAnim;
  double _targetRotation = 0;
  bool _isLoading = true;
  String? _error;
  double? _userLat;
  double? _userLon;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _rotationAnim = Tween<double>(begin: 0, end: 0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
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
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() => _error = 'Leja e lokacionit u refuzua.');
          return;
        }
      }
      if (permission == LocationPermission.deniedForever) {
        setState(() => _error = 'Leja e lokacionit është refuzuar përgjithmonë.');
        return;
      }

      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium),
      );

      setState(() {
        _userLat = pos.latitude;
        _userLon = pos.longitude;
        _qiblaAngle = QiblaService.calculateQibla(pos.latitude, pos.longitude);
        _isLoading = false;
      });
    } catch (e) {
      // Default to Kosovo coordinates
      setState(() {
        _userLat = 42.5;
        _userLon = 21.0;
        _qiblaAngle = QiblaService.calculateQibla(42.5, 21.0);
        _isLoading = false;
      });
    }
  }

  void _startCompass() {
    _magnetometerSub = magnetometerEventStream().listen((event) {
      // Convert magnetometer to heading (simplified)
      final heading = math.atan2(event.y, event.x) * 180 / math.pi;
      final normalizedHeading = (heading + 360) % 360;

      if (mounted) {
        setState(() => _compassHeading = normalizedHeading);
        _animateToTarget();
      }
    });
  }

  void _animateToTarget() {
    if (_qiblaAngle == null) return;
    final target = _qiblaAngle! - _compassHeading;
    _rotationAnim = Tween<double>(
      begin: _rotationAnim.value,
      end: target * math.pi / 180,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward(from: 0);
    _targetRotation = target;
  }

  @override
  void dispose() {
    _magnetometerSub?.cancel();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppColors.emerald500),
            SizedBox(height: 16),
            Text('Duke gjetur lokacionin...', style: TextStyle(color: Colors.white70)),
          ],
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.location_off, color: AppColors.amber500, size: 48),
              const SizedBox(height: 16),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => setState(() {
                  _error = null;
                  _isLoading = true;
                  _init();
                }),
                icon: const Icon(Icons.refresh),
                label: const Text('Provo Sërish'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.emerald600,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      );
    }

    final qibla = _qiblaAngle ?? 0;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Coordinates
        if (_userLat != null)
          Text(
            '${_userLat!.toStringAsFixed(4)}°N, ${_userLon!.toStringAsFixed(4)}°E',
            style: const TextStyle(color: Colors.white54, fontSize: 12),
          ),
        const SizedBox(height: 32),

        // Compass
        SizedBox(
          width: 280,
          height: 280,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Outer ring
              Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.emerald700,
                    width: 2,
                  ),
                  gradient: RadialGradient(
                    colors: [
                      AppColors.slate800,
                      AppColors.slate900,
                    ],
                  ),
                ),
              ),
              // Tick marks & cardinal directions
              ..._buildCardinalLabels(),
              // Qibla needle
              AnimatedBuilder(
                animation: _animController,
                builder: (_, __) {
                  return Transform.rotate(
                    angle: _rotationAnim.value,
                    child: _QiblaNeedle(),
                  );
                },
              ),
              // Center dot
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.emerald500,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.emerald500.withOpacity(0.6),
                      blurRadius: 8,
                      spreadRadius: 2,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 32),

        // Bearing display
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          decoration: BoxDecoration(
            color: AppColors.emerald800,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.emerald700),
          ),
          child: Column(
            children: [
              const Text(
                '🕋  Drejtimi i Kibles',
                style: TextStyle(
                  color: AppColors.emerald100,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '${qibla.toStringAsFixed(1)}° nga Veriu',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  List<Widget> _buildCardinalLabels() {
    const labels = [
      ('V', 0.0),  // North
      ('L', 90.0), // East
      ('J', 180.0), // South
      ('P', 270.0), // West
    ];

    return labels.map((label) {
      final angle = label.$2 * math.pi / 180;
      const r = 115.0;
      final x = r * math.sin(angle);
      final y = -r * math.cos(angle);
      return Transform.translate(
        offset: Offset(x, y),
        child: Text(
          label.$1,
          style: TextStyle(
            color: label.$1 == 'V'
                ? AppColors.emerald400
                : Colors.white.withOpacity(0.6),
            fontSize: label.$1 == 'V' ? 18 : 15,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    }).toList();
  }
}

class _QiblaNeedle extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 180,
      height: 180,
      child: CustomPaint(painter: _NeedlePainter()),
    );
  }
}

class _NeedlePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final halfH = size.height / 2;

    // North tip (pointing to Kaaba) — emerald
    final tipPaint = Paint()
      ..color = AppColors.emerald500
      ..style = PaintingStyle.fill;

    // South tip — slate
    final tailPaint = Paint()
      ..color = AppColors.slate500
      ..style = PaintingStyle.fill;

    // North half
    final northPath = Path()
      ..moveTo(center.dx, center.dy - halfH + 8)
      ..lineTo(center.dx - 8, center.dy + 4)
      ..lineTo(center.dx, center.dy)
      ..lineTo(center.dx + 8, center.dy + 4)
      ..close();

    // South half
    final southPath = Path()
      ..moveTo(center.dx, center.dy + halfH - 8)
      ..lineTo(center.dx - 8, center.dy - 4)
      ..lineTo(center.dx, center.dy)
      ..lineTo(center.dx + 8, center.dy - 4)
      ..close();

    canvas.drawPath(southPath, tailPaint);
    canvas.drawPath(northPath, tipPaint);

    // Glow on tip
    final glowPaint = Paint()
      ..color = AppColors.emerald400.withOpacity(0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    canvas.drawPath(northPath, glowPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
