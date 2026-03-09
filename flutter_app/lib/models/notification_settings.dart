class NotificationSettings {
  final bool masterEnabled;
  final bool soundEnabled;
  final int advanceMinutes; // 0, 5, 10, 15
  final Map<String, bool> prayers;

  const NotificationSettings({
    this.masterEnabled = false,
    this.soundEnabled = true,
    this.advanceMinutes = 0,
    this.prayers = const {
      'imsak':   false,
      'fajr':    true,
      'dhuhr':   true,
      'asr':     true,
      'maghrib': true,
      'isha':    true,
    },
  });

  NotificationSettings copyWith({
    bool? masterEnabled,
    bool? soundEnabled,
    int? advanceMinutes,
    Map<String, bool>? prayers,
  }) {
    return NotificationSettings(
      masterEnabled:  masterEnabled  ?? this.masterEnabled,
      soundEnabled:   soundEnabled   ?? this.soundEnabled,
      advanceMinutes: advanceMinutes ?? this.advanceMinutes,
      prayers:        prayers        ?? Map.from(this.prayers),
    );
  }

  Map<String, dynamic> toJson() => {
        'masterEnabled':  masterEnabled,
        'soundEnabled':   soundEnabled,
        'advanceMinutes': advanceMinutes,
        'prayers':        prayers,
      };

  factory NotificationSettings.fromJson(Map<String, dynamic> j) {
    return NotificationSettings(
      masterEnabled:  j['masterEnabled']  as bool? ?? false,
      soundEnabled:   j['soundEnabled']   as bool? ?? true,
      advanceMinutes: j['advanceMinutes'] as int?  ?? 0,
      prayers: {
        'imsak':   (j['prayers'] as Map?)?.cast<String, bool>()['imsak']   ?? false,
        'fajr':    (j['prayers'] as Map?)?.cast<String, bool>()['fajr']    ?? true,
        'dhuhr':   (j['prayers'] as Map?)?.cast<String, bool>()['dhuhr']   ?? true,
        'asr':     (j['prayers'] as Map?)?.cast<String, bool>()['asr']     ?? true,
        'maghrib': (j['prayers'] as Map?)?.cast<String, bool>()['maghrib'] ?? true,
        'isha':    (j['prayers'] as Map?)?.cast<String, bool>()['isha']    ?? true,
      },
    );
  }
}
