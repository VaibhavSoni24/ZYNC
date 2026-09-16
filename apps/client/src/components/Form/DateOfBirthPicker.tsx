import React, { useState } from 'react';

interface DateOfBirthPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (isoDate: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_AGE_YEAR = CURRENT_YEAR - 13; // At least 13 years old
const MAX_AGE_YEAR = CURRENT_YEAR - 95; // Up to 95 years old

const YEARS = Array.from(
  { length: MIN_AGE_YEAR - MAX_AGE_YEAR + 1 },
  (_, i) => (MIN_AGE_YEAR - i).toString()
);

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  required = true
}) => {
  // Parse existing YYYY-MM-DD
  const parts = value ? value.split('-') : ['', '', ''];
  const [year, setYear] = useState(parts[0] || '');
  const [month, setMonth] = useState(parts[1] || '');
  const [day, setDay] = useState(parts[2] || '');

  // Calculate days in selected month and year
  const getDaysInMonth = (m: string, y: string) => {
    if (!m) return 31;
    const mNum = parseInt(m, 10);
    const yNum = parseInt(y, 10) || 2000;
    return new Date(yNum, mNum, 0).getDate();
  };

  const daysCount = getDaysInMonth(month, year);
  const DAYS = Array.from({ length: daysCount }, (_, i) => {
    const val = (i + 1).toString().padStart(2, '0');
    return { value: val, label: (i + 1).toString() };
  });

  const handleUpdate = (newMonth: string, newDay: string, newYear: string) => {
    setMonth(newMonth);
    setDay(newDay);
    setYear(newYear);

    if (newYear && newMonth && newDay) {
      onChange(`${newYear}-${newMonth}-${newDay}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-secondary">
          Date of Birth <span className="text-[10px] text-text-muted font-normal">(Month / Day / Year)</span>
        </label>
        <span className="text-[10px] text-accent-blue font-mono">13+ Required</span>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {/* Month Dropdown (5 cols) */}
        <div className="col-span-5 relative">
          <select
            required={required}
            value={month}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => handleUpdate(e.target.value, day, year)}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 rounded-xl px-2.5 py-2.5 text-xs text-text-primary focus:outline-none transition appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-[#0f0f1c] text-text-muted">
              Month
            </option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value} className="bg-[#0f0f1c] text-text-primary">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day Dropdown (3 cols) */}
        <div className="col-span-3 relative">
          <select
            required={required}
            value={day}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => handleUpdate(month, e.target.value, year)}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 rounded-xl px-2.5 py-2.5 text-xs text-text-primary focus:outline-none transition appearance-none cursor-pointer text-center"
          >
            <option value="" disabled className="bg-[#0f0f1c] text-text-muted">
              Day
            </option>
            {DAYS.map((d) => (
              <option key={d.value} value={d.value} className="bg-[#0f0f1c] text-text-primary">
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown (4 cols) */}
        <div className="col-span-4 relative">
          <select
            required={required}
            value={year}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => handleUpdate(month, day, e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 rounded-xl px-2.5 py-2.5 text-xs text-text-primary focus:outline-none transition appearance-none cursor-pointer text-center"
          >
            <option value="" disabled className="bg-[#0f0f1c] text-text-muted">
              Year
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y} className="bg-[#0f0f1c] text-text-primary">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
