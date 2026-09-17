import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DateOfBirthPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (isoDate: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
}

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth() + 1; // 1-12
const CURRENT_DAY = TODAY.getDate(); // 1-31
const MIN_YEAR = 1900;

const ALL_MONTHS = [
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

const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => (CURRENT_YEAR - i).toString()
);

interface CustomSelectProps {
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onFocus?: () => void;
  align?: 'left' | 'center';
}

const CustomDropdown: React.FC<CustomSelectProps> = ({
  placeholder,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  onFocus,
  align = 'left'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => {
          if (!isOpen && onFocus) onFocus();
          onToggle();
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border ${
          isOpen
            ? 'border-accent-blue ring-1 ring-accent-blue/40 bg-white/[0.07]'
            : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]'
        } text-xs transition duration-200 focus:outline-none cursor-pointer text-left`}
      >
        <span className={`truncate ${selectedOption ? 'text-white font-medium' : 'text-text-muted/60'} ${align === 'center' ? 'w-full text-center' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1 flex-shrink-0 text-text-muted"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 right-0 mt-1.5 py-1.5 max-h-56 overflow-y-auto rounded-2xl bg-[#0d0d1a] border border-white/[0.12] backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] custom-scrollbar"
            style={{ minWidth: '100%' }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-accent-blue/15 text-accent-blue font-semibold'
                      : 'text-text-secondary hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className={`truncate ${align === 'center' ? 'w-full text-center' : ''}`}>{opt.label}</span>
                  {isSelected && <Check size={12} className="text-accent-blue ml-1 flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  required = true
}) => {
  const parts = value ? value.split('-') : ['', '', ''];
  const [year, setYear] = useState(parts[0] || '');
  const [month, setMonth] = useState(parts[1] || '');
  const [day, setDay] = useState(parts[2] || '');

  const [openDropdown, setOpenDropdown] = useState<'month' | 'day' | 'year' | null>(null);

  // Available months: if current year, restrict to months up to current month
  const availableMonths = ALL_MONTHS.filter((m) => {
    if (year === CURRENT_YEAR.toString()) {
      return parseInt(m.value, 10) <= CURRENT_MONTH;
    }
    return true;
  });

  // Calculate days in selected month and year, capping at current day if current year and month
  const getDaysInMonth = (m: string, y: string) => {
    if (!m) return 31;
    const mNum = parseInt(m, 10);
    const yNum = parseInt(y, 10) || 2000;
    const totalDays = new Date(yNum, mNum, 0).getDate();

    if (yNum === CURRENT_YEAR && mNum === CURRENT_MONTH) {
      return Math.min(totalDays, CURRENT_DAY);
    }
    return totalDays;
  };

  const daysCount = getDaysInMonth(month, year);
  const DAYS = Array.from({ length: daysCount }, (_, i) => {
    const val = (i + 1).toString().padStart(2, '0');
    return { value: val, label: (i + 1).toString() };
  });

  const handleUpdate = (newMonth: string, newDay: string, newYear: string) => {
    let validMonth = newMonth;
    let validDay = newDay;

    // Check if newYear is current year
    if (newYear === CURRENT_YEAR.toString()) {
      if (validMonth && parseInt(validMonth, 10) > CURRENT_MONTH) {
        validMonth = CURRENT_MONTH.toString().padStart(2, '0');
      }
      if (validMonth && parseInt(validMonth, 10) === CURRENT_MONTH && validDay) {
        if (parseInt(validDay, 10) > CURRENT_DAY) {
          validDay = CURRENT_DAY.toString().padStart(2, '0');
        }
      }
    }

    // Check max days for the month
    if (validMonth && validDay) {
      const maxDays = getDaysInMonth(validMonth, newYear);
      if (parseInt(validDay, 10) > maxDays) {
        validDay = maxDays.toString().padStart(2, '0');
      }
    }

    setMonth(validMonth);
    setDay(validDay);
    setYear(newYear);

    if (newYear && validMonth && validDay) {
      onChange(`${newYear}-${validMonth}-${validDay}`);
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
      </div>

      <div className="grid grid-cols-12 gap-2 relative z-30">
        {/* Month Dropdown (5 cols) */}
        <div className="col-span-5 relative">
          <CustomDropdown
            placeholder="Month"
            value={month}
            options={availableMonths}
            isOpen={openDropdown === 'month'}
            onToggle={() => setOpenDropdown((prev) => (prev === 'month' ? null : 'month'))}
            onClose={() => {
              setOpenDropdown(null);
              if (onBlur) onBlur();
            }}
            onFocus={onFocus}
            onSelect={(val) => handleUpdate(val, day, year)}
          />
        </div>

        {/* Day Dropdown (3 cols) */}
        <div className="col-span-3 relative">
          <CustomDropdown
            placeholder="Day"
            value={day}
            options={DAYS}
            isOpen={openDropdown === 'day'}
            onToggle={() => setOpenDropdown((prev) => (prev === 'day' ? null : 'day'))}
            onClose={() => {
              setOpenDropdown(null);
              if (onBlur) onBlur();
            }}
            onFocus={onFocus}
            onSelect={(val) => handleUpdate(month, val, year)}
            align="center"
          />
        </div>

        {/* Year Dropdown (4 cols) */}
        <div className="col-span-4 relative">
          <CustomDropdown
            placeholder="Year"
            value={year}
            options={YEARS.map((y) => ({ value: y, label: y }))}
            isOpen={openDropdown === 'year'}
            onToggle={() => setOpenDropdown((prev) => (prev === 'year' ? null : 'year'))}
            onClose={() => {
              setOpenDropdown(null);
              if (onBlur) onBlur();
            }}
            onFocus={onFocus}
            onSelect={(val) => handleUpdate(month, day, val)}
            align="center"
          />
        </div>
      </div>

      {/* Hidden input for standard form validation */}
      <input
        type="hidden"
        required={required}
        value={year && month && day ? `${year}-${month}-${day}` : ''}
      />
    </div>
  );
};
