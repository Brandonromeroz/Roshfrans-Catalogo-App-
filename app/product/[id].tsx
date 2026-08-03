import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Header, Loading, ProductDetail } from '@/components';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useAppTheme } from '@/theme/useAppTheme';

export default function ProductDetailScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; q?: string }>();
  const { getProductById, isLoading, isReady } = useProducts();

  const product = useMemo(() => {
    const id = Number(params.id);
    if (Number.isNaN(id)) return undefined;
    return getProductById(id);
  }, [getProductById, params.id]);

  if (isLoading || !isReady) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]}>
        <Loading fullScreen />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]}>
        <Header showBack onBack={() => router.back()} title="No encontrado" showLogo={false} />
        <EmptyState
          icon="package-variant-closed"
          title="Producto no encontrado"
          description="El producto no existe en el catálogo."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]} edges={['top']}>
      <Header
        showBack
        showLogo={false}
        onBack={() => router.back()}
        title="Detalle"
        subtitle={product.marca}
      />
      <View style={styles.content}>
        <ProductDetail product={product} searchQuery={params.q} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
