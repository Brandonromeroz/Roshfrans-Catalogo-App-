import { STORAGE_KEYS } from '@/constants/storage';
import { StorageService } from './storage.service';

export class FavoriteService {
  static async getFavorites(): Promise<number[]> {
    const favorites = await StorageService.getItem<number[]>(STORAGE_KEYS.FAVORITES);
    return favorites ?? [];
  }

  static async saveFavorites(favoriteIds: number[]): Promise<void> {
    await StorageService.setItem(STORAGE_KEYS.FAVORITES, favoriteIds);
  }

  static async toggleFavorite(productId: number): Promise<number[]> {
    const favorites = await this.getFavorites();
    const exists = favorites.includes(productId);
    const updated = exists ? favorites.filter((id) => id !== productId) : [...favorites, productId];
    await this.saveFavorites(updated);
    return updated;
  }

  static async isFavorite(productId: number): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(productId);
  }

  static async clearFavorites(): Promise<void> {
    await StorageService.removeItem(STORAGE_KEYS.FAVORITES);
  }
}
