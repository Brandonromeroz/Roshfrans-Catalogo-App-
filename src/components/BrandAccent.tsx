import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BRAND } from '@/theme/brand';

interface BrandAccentProps {
  height?: number;
}

export const BrandAccent: React.FC<BrandAccentProps> = ({ height = 3 }) => (
  <View style={styles.wrapper}>
    <View style={[styles.gold, { height }]} />
    <View style={[styles.black, { height: height / 2 }]} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  gold: {
    backgroundColor: BRAND.gold,
    width: '100%',
  },
  black: {
    backgroundColor: BRAND.black,
    width: '100%',
  },
});
