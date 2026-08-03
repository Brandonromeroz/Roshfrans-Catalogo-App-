import { useCallback, useEffect } from 'react';
import { useProductsStore } from '@/store/productsStore';

export const useProducts = () => {
  const products = useProductsStore((s) => s.products);
  const catalog = useProductsStore((s) => s.catalog);
  const isLoading = useProductsStore((s) => s.isLoading);
  const isReady = useProductsStore((s) => s.isReady);
  const error = useProductsStore((s) => s.error);
  const loadProducts = useProductsStore((s) => s.loadProducts);
  const getProductById = useProductsStore((s) => s.getProductById);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const getById = useCallback((id: number) => getProductById(id), [getProductById]);

  return {
    products,
    catalog,
    isLoading,
    isReady,
    error,
    totalProducts: catalog?.totalProducts ?? products.length,
    reload: loadProducts,
    getProductById: getById,
  };
};
