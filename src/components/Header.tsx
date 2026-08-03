import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { BrandAccent } from '@/components/BrandAccent';
import { BrandLogo } from '@/components/BrandLogo';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showLogo = true,
}) => {
  const { colors, brand } = useAppTheme();

  if (showBack) {
    return (
      <View>
        <Appbar.Header style={[styles.appBar, { backgroundColor: colors.headerBg }]} elevated>
          <Appbar.BackAction onPress={onBack} color={brand.brandGold} />
          <Appbar.Content
            title={title ?? 'Detalle'}
            subtitle={subtitle}
            titleStyle={[styles.appBarTitle, { color: '#FFFFFF' }]}
            subtitleStyle={[styles.appBarSubtitle, { color: brand.brandGold }]}
          />
          {rightAction}
        </Appbar.Header>
        <BrandAccent />
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.container, { backgroundColor: colors.headerBg }]}>
        <View style={styles.topRow}>
          {showLogo ? <BrandLogo variant="header" /> : null}
          {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
        </View>
        {subtitle ? (
          <Text variant="bodySmall" style={[styles.subtitle, { color: brand.brandGold }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <BrandAccent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightAction: {
    marginLeft: spacing.sm,
  },
  subtitle: {
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  appBar: {
    elevation: 0,
  },
  appBarTitle: {
    fontWeight: '700',
  },
  appBarSubtitle: {
    fontWeight: '500',
  },
});
