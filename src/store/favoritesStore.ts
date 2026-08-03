import { create } from 'zustand';
import { FavoriteService } from '@/features/products/services/favorite.service';

interface FavoritesState {
  favoriteIds: number[];
  isLoading: boolean;
  isReady: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],
  isLoading: false,
  isReady: false,

  loadFavorites: async () => {
    if (get().isReady) return;
    set({ isLoading: true });
    const favoriteIds = await FavoriteService.getFavorites();
    set({ favoriteIds, isLoading: false, isReady: true });
  },

  toggleFavorite: async (productId: number) => {
    const updated = await FavoriteService.toggleFavorite(productId);
    set({ favoriteIds: updated });
  },

  isFavorite: (productId: number) => get().favoriteIds.includes(productId),

  clearFavorites: async () => {
    await FavoriteService.clearFavorites();
    set({ favoriteIds: [] });
  },
}));
