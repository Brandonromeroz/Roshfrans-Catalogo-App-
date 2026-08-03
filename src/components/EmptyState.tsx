import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'magnify-close',
  title,
  description,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Icon source={icon} size={64} color={colors.cardTextMuted} />
      <Text variant="titleMedium" style={[styles.title, { color: colors.sectionTitle }]}>
        {title}
      </Text>
      {description ? (
        <Text variant="bodyMedium" style={[styles.description, { color: colors.sectionSubtitle }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  title: { textAlign: 'center', fontWeight: '600' },
  description: { textAlign: 'center' },
});
