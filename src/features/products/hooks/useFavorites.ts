import { useCallback, useEffect } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useProductsStore } from '@/store/productsStore';
import type { Product } from '@/features/products/types/product.types';

export const useFavorites = () => {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const isLoading = useFavoritesStore((s) => s.isLoading);
  const isReady = useFavoritesStore((s) => s.isReady);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);
  const products = useProductsStore((s) => s.products);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const favoriteProducts: Product[] = products.filter((p) => favoriteIds.includes(p.id));

  const toggle = useCallback(
    async (productId: number) => {
      await toggleFavorite(productId);
    },
    [toggleFavorite],
  );

  return {
    favoriteIds,
    favoriteProducts,
    isLoading,
    isReady,
    isFavorite,
    toggleFavorite: toggle,
    clearFavorites,
    count: favoriteIds.length,
  };
};
