import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { SEARCH_CONFIG } from '@/constants/config';
import type { SearchFormValues } from '@/components/SearchBar';
import { searchService } from '@/features/products/services/search.service';
import type { Product } from '@/features/products/types/product.types';
import { useHistoryStore } from '@/store/historyStore';
import { useProductsStore } from '@/store/productsStore';

const useDebounce = (value: string, delay: number): string => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export const useSearch = () => {
  const isReady = useProductsStore((s) => s.isReady);
  const addToHistory = useHistoryStore((s) => s.addToHistory);

  const { control, setValue, reset, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  const query = useWatch({ control, name: 'query', defaultValue: '' });
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, SEARCH_CONFIG.DEBOUNCE_MS);
  const hasQuery = debouncedQuery.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH;

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!isReady) return [];
      const trimmed = searchQuery.trim();
      if (trimmed.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) return [];
      return searchService.search(trimmed);
    },
    [isReady],
  );

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchResults = performSearch(debouncedQuery);
    setResults(searchResults);
    setIsSearching(false);
  }, [debouncedQuery, hasQuery, performSearch]);

  const submitSearch = useCallback(
    async (searchQuery?: string) => {
      const q = searchQuery ?? query;
      if (q.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
        await addToHistory(q.trim());
      }
    },
    [addToHistory, query],
  );

  const searchFromHistory = useCallback(
    (historyQuery: string) => {
      setValue('query', historyQuery);
    },
    [setValue],
  );

  const clearSearch = useCallback(() => {
    reset({ query: '' });
    setResults([]);
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    await addToHistory(data.query.trim());
  });

  const resultCount = useMemo(() => results.length, [results]);

  return {
    control,
    query,
    setQuery: (value: string) => setValue('query', value),
    results,
    isSearching,
    hasQuery,
    resultCount,
    submitSearch,
    searchFromHistory,
    clearSearch,
    onSubmit,
  };
};
