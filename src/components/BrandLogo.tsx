import React from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';
import { logoHeader } from '@/assets/images';

interface BrandLogoProps {
  variant?: 'header' | 'compact';
  style?: StyleProp<ImageStyle>;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'header', style }) => {
  const dimensions = variant === 'header' ? styles.headerLogo : styles.compactLogo;

  return (
    <View style={styles.container}>
      <Image
        source={logoHeader}
        style={[dimensions, style]}
        resizeMode="contain"
        accessibilityLabel="Roshfrans - Lubricantes y Especialidades"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 240,
    height: 52,
  },
  compactLogo: {
    width: 180,
    height: 40,
  },
});
