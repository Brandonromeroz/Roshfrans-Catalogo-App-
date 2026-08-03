import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  fullScreen = false,
}) => {
  const { colors, brand } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        fullScreen && { backgroundColor: colors.screen },
      ]}
    >
      <ActivityIndicator size="large" color={brand.brandGold} />
      <Text variant="bodyMedium" style={[styles.message, { color: colors.sectionSubtitle }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  fullScreen: { flex: 1 },
  message: { fontWeight: '500' },
});
