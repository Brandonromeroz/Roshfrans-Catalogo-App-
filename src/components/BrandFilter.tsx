import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { useBrands } from '@/features/products/hooks/useBrands';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

interface BrandFilterProps {
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  resultCount?: number;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onSelectBrand,
  resultCount,
}) => {
  const { colors, brand } = useAppTheme();
  const { brands, total } = useBrands();

  const handleSelectAll = useCallback(() => onSelectBrand(null), [onSelectBrand]);

  if (brands.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <Text variant="labelLarge" style={[styles.title, { color: colors.sectionTitle }]}>
          Filtrar por marca
        </Text>
        <Text variant="labelSmall" style={{ color: colors.sectionSubtitle }}>
          {total} marcas
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled"
      >
        <Chip
          selected={!selectedBrand}
          onPress={handleSelectAll}
          style={[
            styles.chip,
            !selectedBrand
              ? { backgroundColor: brand.brandGold }
              : { backgroundColor: colors.chipBg },
          ]}
          textStyle={{
            color: !selectedBrand ? brand.brandBlack : colors.chipText,
            fontWeight: '600',
          }}
          compact
        >
          Todas
        </Chip>

        {brands.map((marca) => {
          const isSelected = selectedBrand === marca;
          return (
            <Chip
              key={marca}
              selected={isSelected}
              onPress={() => onSelectBrand(isSelected ? null : marca)}
              style={[
                styles.chip,
                isSelected
                  ? { backgroundColor: brand.brandGold }
                  : { backgroundColor: colors.chipBg },
              ]}
              textStyle={{
                color: isSelected ? brand.brandBlack : colors.chipText,
                fontWeight: isSelected ? '700' : '500',
              }}
              compact
            >
              {marca}
            </Chip>
          );
        })}
      </ScrollView>

      {selectedBrand ? (
        <Text variant="bodySmall" style={[styles.resultHint, { color: colors.sectionSubtitle }]}>
          Mostrando {resultCount ?? 0} producto{(resultCount ?? 0) !== 1 ? 's' : ''} de{' '}
          {selectedBrand}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: {
    fontWeight: '700',
  },
  chipsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
    paddingBottom: spacing.sm,
  },
  chip: {
    maxWidth: 180,
  },
  resultHint: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
});
