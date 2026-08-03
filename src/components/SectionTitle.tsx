import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, action }) => {
  const { colors, brand } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: brand.brandGold }]} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text variant="titleSmall" style={[styles.title, { color: colors.sectionTitle }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodySmall" style={[styles.subtitle, { color: colors.sectionSubtitle }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {action}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  accent: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: { flex: 1 },
  title: {
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  subtitle: { marginTop: 2 },
});
