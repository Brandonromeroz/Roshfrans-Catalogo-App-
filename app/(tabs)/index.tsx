import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  BrandFilter,
  EmptyState,
  Header,
  Loading,
  OnboardingModal,
  PaginationFooter,
  ProductCard,
  SearchBar,
  SearchHistory,
  SectionTitle,
} from '@/components';
import { PAGINATION_CONFIG } from '@/constants/config';
import { useCatalog } from '@/features/products/hooks/useCatalog';
import { useHistory } from '@/features/products/hooks/useHistory';
import type { Product } from '@/features/products/types/product.types';
import { useSettingsStore } from '@/store/settingsStore';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

export default function CatalogScreen() {
  const { colors, brand } = useAppTheme();
  const showSearchHistory = useSettingsStore((s) => s.showSearchHistory);
  const hasSeenOnboarding = useSettingsStore((s) => s.hasSeenOnboarding);
  const settingsReady = useSettingsStore((s) => s.isReady);
  const markOnboardingSeen = useSettingsStore((s) => s.markOnboardingSeen);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { history, removeFromHistory, clearHistory } = useHistory();
  const {
    control,
    query,
    mode,
    visibleItems,
    loadMore,
    hasMore,
    isLoadingMore,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    isReady,
    error,
    totalProducts,
    hasQuery,
    isSearching,
    submitSearch,
    searchFromHistory,
    clearSearch,
    clearFilters,
    onSubmit,
    selectedBrand,
    selectBrand,
    hasFilter,
  } = useCatalog();

  useEffect(() => {
    if (settingsReady && isReady && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [settingsReady, isReady, hasSeenOnboarding]);

  const handleOnboardingComplete = useCallback(async () => {
    setShowOnboarding(false);
    await markOnboardingSeen();
  }, [markOnboardingSeen]);

  const handleProductPress = useCallback(
    (product: Product) => {
      void submitSearch();
      router.push({
        pathname: '/product/[id]',
        params: { id: String(product.id), q: query },
      });
    },
    [query, submitSearch],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <ProductCard
        product={item}
        searchQuery={hasQuery ? query : undefined}
        index={index}
        onPress={handleProductPress}
      />
    ),
    [handleProductPress, hasQuery, query],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) loadMore();
  }, [hasMore, isLoadingMore, loadMore]);

  const listHeader = useMemo(
    () => (
      <View>
        {!hasQuery && showSearchHistory && history.length > 0 ? (
          <SearchHistory
            history={history}
            onSelect={searchFromHistory}
            onRemove={(item) => void removeFromHistory(item)}
            onClear={() => void clearHistory()}
          />
        ) : null}

        <BrandFilter
          selectedBrand={selectedBrand}
          onSelectBrand={selectBrand}
          resultCount={totalItems}
        />

        <SectionTitle
          title={
            hasQuery
              ? 'Resultados de búsqueda'
              : hasFilter
                ? `Marca: ${selectedBrand}`
                : 'Catálogo de productos'
          }
          subtitle={
            hasQuery
              ? isSearching
                ? 'Buscando...'
                : `${totalItems} coincidencia${totalItems !== 1 ? 's' : ''}`
              : hasFilter
                ? `${totalItems} producto${totalItems !== 1 ? 's' : ''} filtrados`
                : `${totalProducts.toLocaleString()} productos disponibles`
          }
        />
      </View>
    ),
    [
      hasQuery,
      hasFilter,
      selectedBrand,
      showSearchHistory,
      history,
      isSearching,
      totalItems,
      totalProducts,
      searchFromHistory,
      removeFromHistory,
      clearHistory,
      selectBrand,
    ],
  );

  const listFooter = useMemo(
    () => (
      <PaginationFooter
        visibleCount={visibleItems.length}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        mode={mode}
      />
    ),
    [visibleItems.length, totalItems, currentPage, totalPages, hasMore, isLoadingMore, mode],
  );

  const listEmpty = useMemo(() => {
    if (!hasQuery && !hasFilter) return null;
    return (
      <EmptyState
        icon={hasFilter ? 'filter-off-outline' : 'magnify-close'}
        title="Sin resultados"
        description={
          hasFilter
            ? `No hay productos para la marca "${selectedBrand}". Prueba otra marca o quita el filtro.`
            : 'Prueba con otra marca, producto o aplicación.'
        }
      />
    );
  }, [hasQuery, hasFilter, selectedBrand]);

  if (isLoading || !isReady) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]}>
        <Loading message="Cargando catálogo..." fullScreen />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]}>
        <EmptyState icon="alert-circle-outline" title="Error al cargar" description={error} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]} edges={['top']}>
      <Header subtitle={`${totalProducts.toLocaleString()} lubricantes y especialidades`} />

      <SearchBar
        control={control}
        onSubmit={() => void onSubmit()}
        onClear={() => {
          if (hasFilter && hasQuery) clearFilters();
          else if (hasQuery) clearSearch();
          else if (hasFilter) selectBrand(null);
        }}
      />

      <Animated.View entering={FadeIn.duration(400)} style={styles.listContainer}>
        <FlashList
          data={visibleItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListFooterComponent={totalItems > 0 ? listFooter : undefined}
          ListEmptyComponent={listEmpty}
          onEndReached={handleEndReached}
          onEndReachedThreshold={PAGINATION_CONFIG.LOAD_MORE_THRESHOLD}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </Animated.View>

      {isLoadingMore ? (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: brand.brandBlack, borderColor: brand.brandGold },
          ]}
        >
          <ActivityIndicator size="small" color={brand.brandGold} />
        </View>
      ) : null}

      <OnboardingModal
        visible={showOnboarding}
        onComplete={() => void handleOnboardingComplete()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1 },
  listContent: { paddingBottom: spacing.xxl },
  loadingOverlay: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    padding: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
});
