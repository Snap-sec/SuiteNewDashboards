import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '@/lib/helpers';
import { Globe, Key, Package, Search, Server, X } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/custom/pagination';
import { useGetVmSearchVulnerabilityHistoryQuery, useGetVmSearchVulnerabilityListQuery, useGetVmSearchVulnerabilitySuggestQuery } from '../../../../services/vm/vulnerabilityListApi';
import { SearchCard } from './components/card';
import SearchCapabilityCards from './components/cards/search-capability-cards';
import SearchSkeleton from './components/search-skeleton';


export default function VulnerabilitySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);



  const debouncedSetInputValue = useCallback(
    debounce((value) => {
      setDebouncedInputValue(value);
    }, 400),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.trim().length > 0);
    debouncedSetInputValue(value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue);
      setPage(1);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(inputValue);
    setPage(1);
    setShowSuggestions(false);
  };

  const handleHistoryItemClick = (historyItem) => {
    setInputValue(historyItem);
    setSearchQuery(historyItem);
    setPage(1);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSearchQuery(suggestion);
    setPage(1);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    data: searchResults,
    isLoading,
    isFetching,
    error,
  } = useGetVmSearchVulnerabilityListQuery(
    { search: searchQuery, page, limit },
    {
      skip: !searchQuery.trim(),
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: searchHistoryResults,
    isLoading: isHistoryLoading,
    error: isHistoryError,
  } = useGetVmSearchVulnerabilityHistoryQuery();

  const {
    data: suggestionsResults,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
  } = useGetVmSearchVulnerabilitySuggestQuery(
    { suggest: debouncedInputValue },
    {
      skip: !debouncedInputValue.trim() || !showSuggestions,
    },
  );

  if (isHistoryLoading) {
    return <SearchSkeleton isLoading={true} />;
  }

  // Get suggestions from the history array
  const suggestions = suggestionsResults?.history || [];
  const uniqueSuggestions = suggestions.length > 0 ? [...new Set(suggestions)] : [];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>UniRisk | Search</title>
      </Helmet>
      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-full mx-auto">
          {/* Search Box */}
          <div className="relative" ref={searchRef}>
            {(!searchQuery.trim() && !isLoading && !isFetching) && (
              <SearchCapabilityCards />
            )}

            <Card className="border-1 mt-4">
              <CardContent className="p-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Input
                    type="text"
                    placeholder="Search for vulnerabilities"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    className=""
                  />
                  {inputValue && (
                    <X
                      size={14}
                      className=" cursor-pointer hover:text-muted-foreground"
                      onClick={() => {
                        setInputValue('');
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                    />
                  )}
                  <Button
                    onClick={handleSearchClick}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Search />
                    {isLoading || isFetching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto mt-1"
              >
                {inputValue.trim().length === 0 ? (
                  // ── Empty input: show recent history ──
                  (() => {
                    const history = searchHistoryResults?.history || [];
                    const uniqueHistory = [...new Set(history)];
                    return uniqueHistory.length > 0 ? (
                      <div className="py-1">
                        <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Recent Searches
                        </p>
                        {uniqueHistory.slice(0, 8).map((item, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center gap-2 text-sm"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleHistoryItemClick(item)}
                          >
                            <Search className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">
                        No recent searches
                      </div>
                    );
                  })()
                ) : isSuggestionsLoading ? (
                  // ── Typing: loading state ──
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-muted border-t-foreground rounded-full" />
                      <span className="text-sm text-muted-foreground">Loading suggestions...</span>
                    </div>
                  </div>
                ) : uniqueSuggestions.length > 0 ? (
                  // ── Typing: API suggestions ──
                  <div className="py-1">
                    <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Suggestions
                    </p>
                    {uniqueSuggestions.slice(0, 10).map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center gap-2 text-sm"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Search className="w-3 h-3 text-muted-foreground" />
                        <span className="truncate">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Show loading state */}
          {(isLoading || isFetching) && (
            <div className="mt-6 flex flex-col gap-4 mb-5 lg:mb-10">
              {[...Array(limit || 5)].map((_, i) => (
                <Card key={i} className="border-1">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Show error state */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">
                Error loading search results: {error.message}
              </p>
            </div>
          )}

          {/* Show search results */}
          <div className="flex flex-col gap-4 mt-6">
            {!searchQuery.trim() ? null : isLoading ? null : searchResults?.vulns &&
              searchResults?.vulns.length > 0 ? (
              searchResults.vulns.map((result, index) => (
                <SearchCard
                  title={result?.title}
                  key={index}
                  data={result}
                  searchQuery={searchQuery}
                  assessmentName={result?.assessmentName}
                  linkTo={`/vm/vulnerability-report?id=${result?._id}&assessmentId=${result?.assessmentId}`}
                />
              ))
            ) : searchQuery.trim() ? (
              <div className="mt-4 p-4 bg-accent border rounded-lg">
                <p>No vulnerabilities found for "{searchQuery}"</p>
              </div>
            ) : null}

            {searchQuery.trim() && searchResults?.total > limit && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(searchResults?.total / limit)}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}