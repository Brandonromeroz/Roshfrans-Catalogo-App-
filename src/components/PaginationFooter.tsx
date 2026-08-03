import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/theme/useAppTheme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface PaginationFooterProps {
  visibleCount: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  mode: 'browse' | 'search';
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  visibleCount,
  totalItems,
  currentPage,
  totalPages,
  hasMore,
  isLoadingMore,
  mode,
}) => {
  const { colors, brand } = useAppTheme();

  if (totalItems === 0) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: brand.brandGold,
              width: `${Math.min(100, (visibleCount / totalItems) * 100)}%`,
            },
          ]}
        />
      </View>

      <Text variant="bodySmall" style={[styles.label, { color: colors.footerText }]}>
        {mode === 'search' ? 'Resultados' : 'Catálogo'}: {visibleCount.toLocaleString()} de{' '}
        {totalItems.toLocaleString()}
      </Text>

      <Text variant="labelSmall" style={{ color: colors.footerMuted }}>
        Página {currentPage} de {totalPages}
      </Text>

      {hasMore ? (
        <View style={styles.loadingRow}>
          {isLoadingMore ? (
            <>
              <ActivityIndicator size="small" color={brand.brandGold} />
              <Text variant="labelSmall" style={{ color: colors.footerMuted }}>
                Cargando más...
              </Text>
            </>
          ) : (
            <Text variant="labelSmall" style={{ color: colors.footerMuted }}>
              Desliza para ver más
            </Text>
          )}
        </View>
      ) : (
        <Text variant="labelSmall" style={{ color: brand.brandGold, fontWeight: '600' }}>
          Fin del listado
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.full },
  label: { fontWeight: '600' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
