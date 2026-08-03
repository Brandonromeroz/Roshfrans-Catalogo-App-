import React, { useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { darkTheme, lightTheme } from '@/theme/theme';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useHistoryStore } from '@/store/historyStore';
import { useProductsStore } from '@/store/productsStore';
import { useSettingsStore } from '@/store/settingsStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadProducts = useProductsStore((s) => s.loadProducts);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const loadHistory = useHistoryStore((s) => s.loadHistory);
  const productsReady = useProductsStore((s) => s.isReady);
  const productsLoading = useProductsStore((s) => s.isLoading);
  const favoritesReady = useFavoritesStore((s) => s.isReady);
  const historyReady = useHistoryStore((s) => s.isReady);
  const settingsReady = useSettingsStore((s) => s.isReady);

  useEffect(() => {
    void loadSettings();
    void loadProducts();
    void loadFavorites();
    void loadHistory();
  }, [loadSettings, loadProducts, loadFavorites, loadHistory]);

  const isAppReady =
    settingsReady && productsReady && favoritesReady && historyReady && !productsLoading;

  useEffect(() => {
    if (isAppReady) {
      void SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="product/[id]"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
