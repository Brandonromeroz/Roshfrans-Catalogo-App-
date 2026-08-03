import { create } from 'zustand';
import { SEARCH_CONFIG } from '@/constants/config';
import { STORAGE_KEYS } from '@/constants/storage';
import { StorageService } from '@/features/products/services/storage.service';
import { normalizeText } from '@/utils/text.utils';

interface HistoryState {
  history: string[];
  isLoading: boolean;
  isReady: boolean;
  loadHistory: () => Promise<void>;
  addToHistory: (query: string) => Promise<void>;
  removeFromHistory: (query: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const persistHistory = async (history: string[]) => {
  await StorageService.setItem(STORAGE_KEYS.SEARCH_HISTORY, history);
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  isReady: false,

  loadHistory: async () => {
    if (get().isReady) return;
    set({ isLoading: true });
    const history = await StorageService.getItem<string[]>(STORAGE_KEYS.SEARCH_HISTORY);
    set({ history: history ?? [], isLoading: false, isReady: true });
  },

  addToHistory: async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) return;

    const normalized = normalizeText(trimmed);
    const current = get().history;
    const filtered = current.filter((item) => normalizeText(item) !== normalized);
    const updated = [trimmed, ...filtered].slice(0, SEARCH_CONFIG.MAX_HISTORY_ITEMS);

    await persistHistory(updated);
    set({ history: updated });
  },

  removeFromHistory: async (query: string) => {
    const normalized = normalizeText(query);
    const updated = get().history.filter((item) => normalizeText(item) !== normalized);
    await persistHistory(updated);
    set({ history: updated });
  },

  clearHistory: async () => {
    await StorageService.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    set({ history: [] });
  },
}));
