import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const exampleFilters = [
  { key: "port:", value: "search for ports", example: "port:22" },
  { key: "domain:", value: "search for domains", example: "domain:snapsec.co" },
  { key: "exposure:", value: "search for exposures", example: "exposure:true" },
  { key: "technology:", value: "search for technology", example: "technology:tech1" },
  { key: "ip:", value: "search for ip addresses", example: "ip:10.12.224.24" }
];

function LabeledSearch({
  handleLabels,
  handleSearch,
  placeholder,
  labelsInit = [],
  searchInit = "",
  filters,
  width = "600px"
}) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const suggestionListRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [labels, setLabels] = useState(labelsInit);
  const [search, setSearch] = useState(searchInit);
  const [finalSearch, setFinalSearch] = useState(searchInit);
  const [filteredSuggestions, setFilteredSuggestions] = useState(filters || exampleFilters);
  const [showExamples, setShowExamples] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedElement = event.target;
      const isOutsideSearchContainer = searchContainerRef.current && !searchContainerRef.current.contains(clickedElement);
      const isOutsideSuggestionList = suggestionListRef.current && !suggestionListRef.current.contains(clickedElement);

      if (isOutsideSearchContainer && isOutsideSuggestionList) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useDeepCompareEffect(() => {
    setSearch(searchInit);
    setLabels(labelsInit);
  }, [searchInit, labelsInit]);

  useEffect(() => {
    handleLabels(labels);
  }, [labels]);

  useEffect(() => {
    handleSearch(finalSearch);
  }, [finalSearch]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearch(inputValue);

    if (!inputValue.trim()) {
      setFilteredSuggestions(filters || exampleFilters);
      setIsOpen(true);
      return;
    }

    const filtered = (filters || exampleFilters).filter(filter =>
      filter.key.toLowerCase().startsWith(inputValue.toLowerCase()) ||
      filter.value.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleInputClick = () => {
    setFilteredSuggestions(filters || exampleFilters);
    setIsOpen(true);
    setShowExamples(true);
    setIsFocused(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && search.includes(':')) {
      e.preventDefault();
      const [key, value] = search.split(':');
      if (key && value) {
        setLabels([...labels, { key: key.trim(), value: value.trim() }]);
        setSearch('');
      }
    } else if (e.key === 'Backspace' && search === '') {
      const newLabels = [...labels];
      newLabels.pop();
      setLabels(newLabels);
    } else if (e.key === "Enter") {
      setFinalSearch(search);
    }
  };

  const removeLabel = (index) => {
    const newLabels = labels.filter((_, i) => i !== index);
    setLabels(newLabels);
  };


  useEffect(() => {
    if (inputRef.current && containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const labelsWidth = Array.from(containerRef.current.children)
        .slice(0, -1)
        .reduce((total, child) => total + (child.offsetWidth), 0);
      inputRef.current.style.width = `${Math.max(50, containerWidth - labelsWidth - 20)}px`;
    }
  }, [labels, search]);

  const toggleExamples = (e) => {
    e.stopPropagation();
    setShowExamples(!showExamples);
  };

  return (
    <div
      ref={searchContainerRef}
      className="relative flex flex-col items-center gap-1"
      style={{ width }}
    >
      <div
        ref={containerRef}
        className={`relative flex items-center gap-2 px-3 py-0.5 w-full overflow-auto rounded-lg border transition-all duration-200 ease-in-out ${isFocused ? 'border-blue-500 shadow-md' : 'bg-card shadow-lg border border-border shadow-xs black/5'
          }`}
        onClick={() => {
          inputRef.current?.focus();
          handleInputClick();
        }}
      >
        {labels.map((label, index) => (
          <div
            key={index}
            className="flex items-center gap-1 text-xs bg-accent/100 rounded-full px-2 py-0.5 p-white animate-in fade-in-0 slide-in-from-left-1 duration-200"
          >
            <p className="font-medium mr-1">{label.key}:</p>
            <p className="whitespace-nowrap">{label.value}</p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                removeLabel(index);
              }}
              className="p-gray-400 hover:p-white h-5 w-5 ml-1"
              aria-label="Remove label"
              variant="ghost"
            >
              <X className="h-1 w-1" />
            </Button>
          </div>
        ))}
        <Input
          ref={inputRef}
          className="flex-grow min-w-[25px] p-2 outline-none border-none shadow-none border-transparent focus-visible:ring-[0px] bg-transparent p-white placeholder-gray-500"
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          onFocus={() => {
            setIsFocused(true);
          }}
          placeholder={labels.length === 0 ? placeholder || "Start typing to search…" : ""}
        />
        {
          labels?.length || search ?
            <Button
              onClick={() => {
                setLabels([]);
                setSearch("");
                setFinalSearch("");
              }}
              className="p-gray-400 hover:p-white h-5 w-5 ml-1"
              variant="ghost"
            >
              <X className="h-1 w-1" />
            </Button>
            :
            ''
        }
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionListRef}
          className="absolute z-50 top-full mt-1 border border-default w-full rounded-md bg-popover text-popover-foreground p-default overflow-hidden animate-fade-in"
        >
          <div className="w-full p-3">
            <div className={`grid ${filteredSuggestions.some(filter => filter.example) ? "grid-cols-3" : "grid-cols-2"} gap-4`}>
              <p className="p-base font-medium">Filters</p>
              <p className="p-base font-medium">Explanations</p>
              {filteredSuggestions.some(filter => filter.example) && (
                <p className="p-base font-medium">Examples</p>
              )}
              {filteredSuggestions.map((filter) => (
                <React.Fragment key={filter.key}>
                  <p className="cursor-pointer text-sm text-secondary-foreground"
                    onClick={() => {
                      setSearch(filter.key);
                      setIsOpen(false);
                    }}>
                    {filter.key}
                  </p>
                  <p className="text-sm text-mono">{filter.value}</p>

                  {filter.example && (
                    <p className="p-xs p-default border-default inline-flex border px-2 py-0.5 rounded-full">
                      {filter.example}
                    </p>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabeledSearch;
