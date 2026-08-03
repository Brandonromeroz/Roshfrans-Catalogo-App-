import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage';
import { StorageService } from '@/features/products/services/storage.service';

export type ThemeMode = 'system' | 'light' | 'dark';

interface AppSettings {
  themeMode: ThemeMode;
  showSearchHistory: boolean;
  hasSeenOnboarding: boolean;
}

interface SettingsState extends AppSettings {
  isReady: boolean;
  loadSettings: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setShowSearchHistory: (show: boolean) => Promise<void>;
  markOnboardingSeen: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  themeMode: 'system',
  showSearchHistory: true,
  hasSeenOnboarding: false,
};

const persistSettings = async (settings: AppSettings) => {
  await StorageService.setItem(STORAGE_KEYS.SETTINGS, settings);
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  isReady: false,

  loadSettings: async () => {
    if (get().isReady) return;
    const saved = await StorageService.getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
    if (saved) {
      set({
        themeMode: saved.themeMode ?? 'system',
        showSearchHistory: saved.showSearchHistory ?? true,
        hasSeenOnboarding: saved.hasSeenOnboarding ?? false,
        isReady: true,
      });
    } else {
      set({ isReady: true });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    const settings: AppSettings = {
      themeMode: mode,
      showSearchHistory: get().showSearchHistory,
      hasSeenOnboarding: get().hasSeenOnboarding,
    };
    await persistSettings(settings);
    set({ themeMode: mode });
  },

  setShowSearchHistory: async (show: boolean) => {
    const settings: AppSettings = {
      themeMode: get().themeMode,
      showSearchHistory: show,
      hasSeenOnboarding: get().hasSeenOnboarding,
    };
    await persistSettings(settings);
    set({ showSearchHistory: show });
  },

  markOnboardingSeen: async () => {
    const settings: AppSettings = {
      themeMode: get().themeMode,
      showSearchHistory: get().showSearchHistory,
      hasSeenOnboarding: true,
    };
    await persistSettings(settings);
    set({ hasSeenOnboarding: true });
  },
}));
