import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, IconButton } from 'react-native-paper';
import { SectionTitle } from '@/components/SectionTitle';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelect,
  onRemove,
  onClear,
}) => {
  const { colors, brand } = useAppTheme();

  const handleClear = useCallback(() => onClear(), [onClear]);

  if (history.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.cardBorder },
      ]}
    >
      <SectionTitle
        title="Búsquedas recientes"
        action={
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={brand.brandGold}
            onPress={handleClear}
            accessibilityLabel="Limpiar historial"
          />
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {history.map((item) => (
          <Chip
            key={item}
            mode="flat"
            icon="history"
            onPress={() => onSelect(item)}
            onClose={() => onRemove(item)}
            style={[styles.chip, { backgroundColor: colors.chipBg }]}
            textStyle={{ color: colors.chipText }}
            compact
          >
            {item}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  chipsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: { maxWidth: 200 },
});
