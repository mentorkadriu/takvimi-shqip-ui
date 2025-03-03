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
  formatDate 
}: WeekDateSelectorProps) {
  // Use selectedDate to determine the current week's range
  const weekRange = `${formatDate(weekDates[0]).month} - ${formatDate(weekDates[weekDates.length - 1]).month}`;

  return (
    <div className="relative mb-6">
      {/* Gradient overlays for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none z-10" />
      
      {/* Week range indicator */}
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
        {weekRange}
      </div>
      
      {/* Scrollable container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
        <div className="flex space-x-2 px-4 sm:px-0 py-2 min-w-max">
          {weekDates.map(date => {
            const formattedDate = formatDate(date);
            return (
              <button
                key={formattedDate.fullDate}
                onClick={() => onDateSelect(date)}
                className={`flex flex-col items-center w-14 py-1 rounded-lg transition-colors ${
                  formattedDate.isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
                }`}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate.weekday}</span>
                <span className={`flex items-center justify-center w-10 h-10 my-1 rounded-full ${
                  formattedDate.isToday 
                    ? formattedDate.isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                    : formattedDate.isSelected
                      ? 'bg-blue-500 text-white'
                      : ''
                }`}>
                  {formattedDate.day}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate.month}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 