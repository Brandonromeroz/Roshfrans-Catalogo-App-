import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Header, Loading, ProductCard, SectionTitle } from '@/components';
import { useFavorites } from '@/features/products/hooks/useFavorites';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { Product } from '@/features/products/types/product.types';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { isLoading: productsLoading, isReady } = useProducts();
  const { favoriteProducts, isLoading: favoritesLoading, count } = useFavorites();

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname: '/product/[id]',
        params: { id: String(product.id) },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <ProductCard product={item} index={index} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  if (productsLoading || favoritesLoading || !isReady) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]}>
        <Loading fullScreen message="Cargando favoritos..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]} edges={['top']}>
      <Header showLogo subtitle="Tus productos guardados" />

      {favoriteProducts.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Sin favoritos"
          description="Toca el corazón en cualquier producto del catálogo para guardarlo aquí."
        />
      ) : (
        <View style={styles.listContainer}>
          <SectionTitle
            title="Mis favoritos"
            subtitle={`${count} producto${count !== 1 ? 's' : ''} guardado${count !== 1 ? 's' : ''}`}
          />
          <FlashList
            data={favoriteProducts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1 },
  listContent: { paddingBottom: spacing.xxl },
});
