import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { searchCities } from '@/utils/cityLtvService';

/**
 * Autocomplete field for Brazilian cities using local JSON data.
 * Searches city suggestions from LTV_Cidades.json as user types 
 * and only allows selection of valid cities.
 */
const CityAutocomplete = ({ value = '', onCityChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]); // list of city strings
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const fetchTimeout = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Keep input in sync if parent resets the value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Search cities from local JSON with debounce
  useEffect(() => {
    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current);
    }

    if (inputValue.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    fetchTimeout.current = setTimeout(() => {
      try {
        const results = searchCities(inputValue);
        setSuggestions(results);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar cidades:', err);
        setError('Erro ao buscar cidades');
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(fetchTimeout.current);
    };
  }, [inputValue]);

  // Function to scroll input to top of viewport
  const scrollToInput = () => {
    if (inputRef.current && window.innerWidth < 768) { // Only on mobile
      setTimeout(() => {
        const headerHeight = 80; // Approximate header height
        const rect = inputRef.current.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const targetPosition = elementTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 300); // Delay to allow keyboard to appear
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    scrollToInput();
  };

  // Handle blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow selection
    setTimeout(() => {
      setIsFocused(false);
      setSuggestions([]);
    }, 200);
  };

  // Handle selection of a city
  const handleSelect = (city) => {
    setInputValue(city);
    setSuggestions([]);
    setHighlightIndex(-1);
    setIsFocused(false);
    if (onCityChange) onCityChange(city);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // When typing, clear current selection until a suggestion is chosen
  const handleChange = (e) => {
    setInputValue(e.target.value);
    setHighlightIndex(-1);
    if (onCityChange) onCityChange('');
  };

  // Keyboard navigation for the suggestion list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        Math.min(prev + 1, suggestions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightIndex]);
      }
    }
  };

  // Check if we should show suggestions
  const showSuggestions = isFocused && inputValue.length >= 2 && (isLoading || error || suggestions.length > 0);

  return (
    <div ref={containerRef} className="flex items-center gap-2 relative">
      {/* Icon */}
      <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
        <MapPin className="w-4 h-4 text-green-500" />
      </div>
      <div className="flex-1 relative">
        <label className="block text-xs font-medium text-green-500 mb-1">
          Selecione a cidade do imóvel a ser utilizado como garantia
        </label>
        {/* Input with green border */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={
            inputValue.length < 2 ? 'Digite 2 ou mais caracteres' : 'Busque a cidade'
          }
          className="text-sm w-full px-3 py-2 rounded-md border-2 border-green-500 focus:outline-none focus:border-green-600 transition-colors"
        />
        
        {/* Suggestion dropdown - Fixed positioning for mobile */}
        {showSuggestions && (
          <div className="absolute left-0 right-0 mt-1 z-50">
            <ul className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg">
              {isLoading && (
                <li className="px-3 py-2 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-libra-blue"></div>
                    Buscando...
                  </div>
                </li>
              )}
              {error && !isLoading && (
                <li className="px-3 py-2 text-red-500 text-center">{error}</li>
              )}
              {!isLoading && !error && suggestions.length === 0 && (
                <li className="px-3 py-2 text-gray-500 text-center">Nenhuma cidade encontrada</li>
              )}
              {!isLoading && !error &&
                suggestions.map((city, index) => (
                  <li
                    key={city}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(city);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleSelect(city);
                    }}
                    onMouseEnter={() => setHighlightIndex(index)}
                    className={`cursor-pointer px-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      index === highlightIndex ? 'bg-libra-light text-libra-navy' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="truncate">{city}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CityAutocomplete;
