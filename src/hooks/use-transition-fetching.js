import { useEffect, useRef } from 'react';

/**
 * Custom hook to distinguish user-initiated state transitions (search, pagination, filters)
 * from background polling refetches (e.g., RTK Query pollingInterval).
 *
 * It returns `true` ONLY when tracked params have actively changed and a query is fetching,
 * preventing recurring polling intervals from triggering skeletons while staying on the same state.
 *
 * @param {Object|Array|string} params - Active query parameters or dependency values (e.g. { search, page, limit })
 * @param {boolean} isFetching - Query isFetching flag
 * @param {boolean} isLoading - Query isLoading flag
 * @param {any} data - Query response data
 * @returns {boolean} isTransitionFetching - True only during state transitions, false during background polling.
 */
export function useTransitionFetching(params, isFetching, isLoading, data) {
  const currentKey = typeof params === 'object' && params !== null ? JSON.stringify(params) : String(params);
  const lastLoadedKeyRef = useRef(data ? currentKey : null);

  useEffect(() => {
    if (!isFetching && !isLoading && data) {
      lastLoadedKeyRef.current = currentKey;
    }
  }, [isFetching, isLoading, data, currentKey]);

  const isParamChanging =
    lastLoadedKeyRef.current !== null && lastLoadedKeyRef.current !== currentKey;

  return Boolean(isFetching && isParamChanging);
}

export default useTransitionFetching;
