import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Searchbar } from 'react-native-paper';
import { useAppTheme } from '@/theme/useAppTheme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

export interface SearchFormValues {
  query: string;
}

interface SearchBarProps {
  control: Control<SearchFormValues>;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  control,
  onSubmit,
  onClear,
  placeholder = 'Buscar marca, producto o aplicación...',
}) => {
  const { colors, brand } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg }]}>
      <Controller
        control={control}
        name="query"
        render={({ field: { onChange, value } }) => (
          <Searchbar
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onSubmitEditing={onSubmit}
            onClearIconPress={() => {
              onChange('');
              onClear?.();
            }}
            elevation={0}
            style={[
              styles.searchbar,
              {
                backgroundColor: colors.searchBg,
                borderColor: colors.searchBorder,
              },
            ]}
            inputStyle={[styles.input, { color: colors.searchText }]}
            iconColor={brand.brandGold}
            placeholderTextColor={colors.searchPlaceholder}
            icon="magnify"
            clearIcon="close-circle"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchbar: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
  },
});
