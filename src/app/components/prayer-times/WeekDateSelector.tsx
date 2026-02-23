'use client';

interface DateInfo {
  day: number;
  weekday: string;
  month: string;
  isToday: boolean;
  isSelected: boolean;
  fullDate: string;
}

interface WeekDateSelectorProps {
  onDateSelect: (date: Date) => void;
  weekDates: Date[];
  formatDate: (date: Date) => DateInfo;
}

export default function WeekDateSelector({
  onDateSelect,
  weekDates,
  formatDate,
}: WeekDateSelectorProps) {
  const weekRange = `${formatDate(weekDates[0]).month} – ${formatDate(weekDates[weekDates.length - 1]).month}`;

  return (
    <div className="space-y-1.5">
      {/* Month range label */}
      <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
        {weekRange}
      </p>

      {/* Day pills */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const d = formatDate(date);
          return (
            <button
              key={d.fullDate}
              onClick={() => onDateSelect(date)}
              className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
                d.isSelected
                  ? 'bg-slate-800 dark:bg-slate-700 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`text-[10px] font-medium mb-0.5 ${
                  d.isSelected ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {d.weekday}
              </span>
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
                  d.isToday && d.isSelected
                    ? 'bg-emerald-500 text-white'
                    : d.isToday
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : d.isSelected
                        ? 'text-white'
                        : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {d.day}
              </span>
              <span
                className={`text-[9px] mt-0.5 ${
                  d.isSelected ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                {d.month}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
