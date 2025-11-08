import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';

interface AutoCompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  suggestions,
  value,
  onChange,
  wrapperClassName = '',
  ...props
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    onChange(userInput);

    if (userInput) {
      const filtered = suggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(userInput.toLowerCase())
        )
        .slice(0, 7); // Show up to 7 suggestions

      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (value) {
      const filtered = suggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7);
      if (filtered.length > 0) {
        setShowSuggestions(true);
        setFilteredSuggestions(filtered);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${wrapperClassName}`} ref={wrapperRef}>
      <Input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion + index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 text-sm cursor-pointer text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors duration-150"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
