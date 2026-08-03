import { useCallback, useMemo, useState } from 'react';
import { usePagination } from '@/features/products/hooks/usePagination';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useSearch } from '@/features/products/hooks/useSearch';

export type CatalogMode = 'browse' | 'search';

export const useCatalog = () => {
  const { products, isLoading, isReady, error, totalProducts } = useProducts();
  const search = useSearch();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const baseProducts = useMemo(
    () => (search.hasQuery ? search.results : products),
    [search.hasQuery, search.results, products],
  );

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) return baseProducts;
    return baseProducts.filter((p) => p.marca === selectedBrand);
  }, [baseProducts, selectedBrand]);

  const mode: CatalogMode = search.hasQuery ? 'search' : 'browse';
  const hasFilter = Boolean(selectedBrand);

  const pagination = usePagination(
    filteredProducts,
    undefined,
    `${mode}-${search.hasQuery ? search.query : 'all'}-${selectedBrand ?? 'all'}-${filteredProducts.length}`,
  );

  const selectBrand = useCallback((brand: string | null) => {
    setSelectedBrand(brand);
  }, []);

  const clearBrandFilter = useCallback(() => {
    setSelectedBrand(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedBrand(null);
    search.clearSearch();
  }, [search]);

  return {
    ...search,
    ...pagination,
    products: filteredProducts,
    mode,
    selectedBrand,
    selectBrand,
    clearBrandFilter,
    clearFilters,
    hasFilter,
    isLoading,
    isReady,
    error,
    totalProducts,
  };
};
