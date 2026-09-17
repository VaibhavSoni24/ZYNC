import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronDown, Check, X } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

export const WORLD_LANGUAGES: LanguageOption[] = [
  // Top / Most Common Watch Party Languages
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese (Mandarin)', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'it', name: 'Italian', native: 'Italiano' },

  // South Asian & Regional Languages
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },

  // Southeast & East Asian Languages
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'tl', name: 'Tagalog (Filipino)', native: 'Wikang Tagalog' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာစာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'yue', name: 'Cantonese', native: '粵語' },

  // European Languages
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg' },
  { code: 'sq', name: 'Albanian', native: 'Shqip' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski' },
  { code: 'ca', name: 'Catalan', native: 'Català' },
  { code: 'eu', name: 'Basque', native: 'Euskara' },
  { code: 'gl', name: 'Galician', native: 'Galego' },

  // Middle Eastern & Central Asian Languages
  { code: 'fa', name: 'Persian (Farsi)', native: 'فارسی' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbekcha' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն' },
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'ps', name: 'Pashto', native: 'پښتو' },
  { code: 'tk', name: 'Turkmen', native: 'Türkmençe' },

  // African Languages
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'yo', name: 'Yoruba', native: 'Èdè Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Asụsụ Igbo' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'so', name: 'Somali', native: 'Soomaaliga' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'om', name: 'Oromo', native: 'Afaan Oromoo' },
  { code: 'mg', name: 'Malagasy', native: 'Fiteny Malagasy' },

  // Multilingual & Other
  { code: 'multi', name: 'Multilingual / Any', native: 'Universal' },
  { code: 'other', name: 'Other Language', native: 'Other' }
];

interface SearchableLanguageSelectProps {
  value: string;
  onChange: (languageName: string) => void;
  disabled?: boolean;
}

export const SearchableLanguageSelect: React.FC<SearchableLanguageSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-detect whether to open upwards or downwards based on viewport space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 280 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter languages
  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return WORLD_LANGUAGES;
    return WORLD_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.native.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedOption = WORLD_LANGUAGES.find((lang) => lang.name === value) || {
    code: 'en',
    name: value || 'English',
    native: 'English'
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border ${
          isOpen
            ? 'border-accent-blue ring-2 ring-accent-blue/20 bg-white/[0.07]'
            : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]'
        } text-sm text-text-primary transition duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Globe size={16} className="text-accent-blue flex-shrink-0" />
          <span className="font-medium text-white truncate">{selectedOption.name}</span>
          <span className="text-xs text-text-muted/70 truncate hidden sm:inline">
            ({selectedOption.native})
          </span>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="ml-2 text-text-muted flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute ${
              openUpward
                ? 'bottom-[calc(100%+8px)] origin-bottom'
                : 'top-[calc(100%+8px)] origin-top'
            } left-0 right-0 z-50 rounded-2xl backdrop-blur-2xl bg-[#0e0e1a]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-64`}
          >
            {/* Sticky Search Header */}
            <div className="p-3 border-b border-white/10 bg-[#0e0e1a]/80 sticky top-0 z-10">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white/[0.06] border border-white/[0.1] focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Language List */}
            <div className="overflow-y-auto overflow-x-hidden p-1.5 space-y-0.5 custom-scrollbar flex-1">
              {filteredLanguages.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted">
                  No languages matching <strong className="text-white">"{searchQuery}"</strong>
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = lang.name === value;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onChange(lang.name);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition duration-150 text-left ${
                        isSelected
                          ? 'bg-accent-blue/15 text-accent-blue font-semibold border border-accent-blue/30 shadow-[0_0_15px_rgba(46,124,246,0.15)]'
                          : 'text-text-secondary hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] uppercase text-text-muted/70 w-6 flex-shrink-0">
                          {lang.code}
                        </span>
                        <span className="truncate">{lang.name}</span>
                        <span className="text-[11px] text-text-muted/60 truncate">
                          ({lang.native})
                        </span>
                      </div>

                      {isSelected && (
                        <Check size={14} className="text-accent-blue flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
