import React, { useEffect, useRef, useState } from 'react';
import { FileText, Loader2, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

// NOTE: removed ScrollArea import because we'll use native overflow-y-auto

const SearchCommandPalette = ({
  apiEndpoint = 'https://suite.snapsec.co/util/v1/docs/search',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiEndpoint}?query=${encodeURIComponent(query)}`,
        );

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        const transformed = [];

        // if (data.group_chunks) {
        //   data.group_chunks.forEach((group) => {
        //     group.metadata?.forEach((metaItem) => {
        //       metaItem.metadata?.forEach((chunk) => {
        //         transformed.push({
        //           id: chunk.id,
        //           title: chunk.metadata?.title || 'Untitled',
        //           description: chunk.chunk_html
        //             ?.replace(/<[^>]*>/g, '')
        //             .substring(0, 200),
        //           link: group.group_name,
        //           hash: chunk.metadata?.hash,
        //           breadcrumbs: chunk.metadata?.breadcrumbs || [],
        //           icon: chunk.metadata?.icon,
        //           score: metaItem.score,
        //           highlights: metaItem.highlights || [],
        //         });
        //       });
        //     });
        //   });
        // }

        if (data.results) {
          data.results.forEach((result) => {
            const group = result.group;

            result.chunks.forEach(({ chunk, highlights, score }) => {
              transformed.push({
                id: chunk.id,
                title: chunk.metadata?.title || 'Untitled',
                description: chunk.chunk_html
                  ?.replace(/<[^>]*>/g, '')
                  .substring(0, 200),
                link: chunk.link || group.name,
                hash: chunk.metadata?.hash,
                breadcrumbs: chunk.metadata?.breadcrumbs || [],
                icon: chunk.metadata?.icon,
                score,
                highlights,
              });
            });
          });
        }

        setResults(transformed);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, apiEndpoint]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setError(null);
  };

  const handleResultClick = (result) => {
    const baseUrl = 'https://docs.snapsec.co/';
    let fullUrl = `${baseUrl}/${result.link}`;
    if (result.hash) fullUrl += `#${result.hash}`;
    window.open(fullUrl, '_blank');
    handleClose();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true);
          setResults([]);
          setQuery('');
        }}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg"
      >
        <Search className="w-4 h-4" />
        <span className=" text-muted-foreground">Search documentation...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded">
          <span className=" font-bold">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-visible">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              Search Documentation
            </DialogTitle>
          </DialogHeader>

          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
            />

            {loading && (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            )}

            {/* <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </Button> */}
          </div>

          {/* RESULTS: use native overflow with a fixed max-height so scrolling works */}
          <div className="max-h-[60vh] overflow-y-auto">
            {error && (
              <p className="px-4 py-8 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {!query.trim() && !loading && (
              <p className="px-4 py-5 text-center text-sm text-muted-foreground">
                Type to search documentation...
              </p>
            )}

            {query.trim() && !loading && results.length === 0 && !error && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((result, i) => (
                  <button
                    key={result.id || i}
                    onClick={() => handleResultClick(result)}
                    className=" cursor-pointer w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-0"
                  >
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground mb-1">
                        {result.title}
                      </div>

                      {result.breadcrumbs?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          {result.breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                              <span>{crumb}</span>
                              {idx < result.breadcrumbs.length - 1 && (
                                <span>›</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {result.highlights?.length > 0 ? (
                        <div
                          className="text-sm text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: result.highlights[0].replace(
                              /<mark>/g,
                              '<mark class="bg-yellow-300/50 font-medium">',
                            ),
                          }}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                      )}

                      {result.link && (
                        <p className="text-xs text-primary mt-1 opacity-60 group-hover:opacity-100">
                          /{result.link}
                        </p>
                      )}
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {result.score?.toFixed(1)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="kbd font-bold">↵</kbd> select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="kbd font-bold">esc</kbd> close
              </span>
            </div>
            <span>
              Press <kbd className="kbd font-bold">⌘K</kbd> to toggle
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCommandPalette;
