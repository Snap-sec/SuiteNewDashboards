import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

function SearchInput({
  onChange,
  onKeyDown, // add this
  value,     // add this
  placeholder,
  className,
  inputClass,
  isSearching = false, // used to display spinner when searching
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (onChange)
      onChange(e)
  };

  // Use controlled value if provided, else internal state
  const inputValue = value !== undefined ? value : searchQuery;

  return (
    <div className={`relative ${className ? className : 'w-60'}`}>
      <Search className="z-10 size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

      <Input
        type="search"
        name="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        data-1p-ignore="true"
        data-lpignore="true"
        data-form-type="other"
        placeholder={placeholder || 'Search Logs...'}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className={`pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none ${inputClass || ''}`}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* Spinner on the right */}
        {isSearching && (
          <svg
            className="h-5 w-5 text-blue-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        )}

        {inputValue.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              if (onChange) onChange({ target: { value: '' } });
            }}
            className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export { SearchInput };
