import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CityAutocompleteProps {
  /** Currently selected value ('' when nothing is selected). */
  value: string;
  /** Called with a chosen value, or '' when cleared. */
  onChange: (city: string) => void;
  /** The list of selectable values (suggestions). */
  options: string[];
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  /** Classes applied to the text input. */
  inputClassName?: string;
  /** Show a clear (×) button when a value is selected. Useful for the search filter. */
  clearable?: boolean;
  /**
   * When true, free text not present in `options` is accepted (options act as
   * suggestions only). When false (default), typed text must resolve to an
   * option or it is reverted on blur.
   */
  allowCustom?: boolean;
  /** Optional cleaner applied to free-text values before committing (allowCustom mode). */
  cleanCustomValue?: (value: string) => string;
}

/**
 * A searchable picker. By default the user can only commit a value that exists
 * in `options` (free-text that doesn't match is reverted on blur). With
 * `allowCustom`, free text is accepted and `options` are merely suggestions.
 */
const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  options,
  id,
  ariaLabel,
  placeholder,
  inputClassName,
  clearable = false,
  allowCustom = false,
  cleanCustomValue,
}) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the visible text in sync when the value changes from outside.
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // The suggestions list is rendered in a portal anchored to the input's
  // position. This keeps it visible even when an ancestor uses `overflow-hidden`
  // or creates a stacking context (e.g. the search hero), instead of being
  // clipped or painted underneath other content.
  useLayoutEffect(() => {
    if (!open) return;
    const updateRect = () => {
      const el = inputRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMenuRect({ top: r.bottom, left: r.left, width: r.width });
    };
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // When the box shows the current selection (untouched), reveal the full list.
    if (!q || q === value.toLowerCase()) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, value, options]);

  const commit = (city: string) => {
    onChange(city);
    setQuery(city);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    const match = options.find((o) => o.toLowerCase() === query.trim().toLowerCase());
    if (match) {
      if (match !== value) onChange(match);
      setQuery(match);
    } else if (allowCustom) {
      // Accept free text (e.g. a brand-new city), cleaned if a cleaner was given.
      const cleaned = cleanCustomValue ? cleanCustomValue(query) : query.trim();
      if (cleaned !== value) onChange(cleaned);
      setQuery(cleaned);
    } else {
      setQuery(value); // revert typed-but-invalid text
    }
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        commit(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputClassName}
      />

      {clearable && value && (
        <button
          type="button"
          aria-label="Clear city filter"
          // Use mousedown so the input doesn't blur-revert before we clear.
          onMouseDown={(e) => {
            e.preventDefault();
            commit('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {open && filtered.length > 0 && menuRect &&
        createPortal(
          <ul
            role="listbox"
            style={{
              position: 'fixed',
              top: menuRect.top + 4,
              left: menuRect.left,
              width: menuRect.width,
              zIndex: 1000,
            }}
            className="max-h-60 overflow-auto rounded-xl bg-white py-1 text-left text-base text-gray-800 shadow-xl border border-gray-100"
          >
            {filtered.map((city, index) => (
              <li
                key={city}
                role="option"
                aria-selected={city === value}
                // mousedown (not click) so the input keeps focus and doesn't blur-revert.
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(city);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer px-4 py-2 ${
                  index === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                } ${city === value ? 'font-semibold' : ''}`}
              >
                {city}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default CityAutocomplete;
