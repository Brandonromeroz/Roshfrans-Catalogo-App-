import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { IconButton } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useFavorites } from '@/features/products/hooks/useFavorites';
import { useAppTheme } from '@/theme/useAppTheme';

interface FavoriteButtonProps {
  productId: number;
  size?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId, size = 24 }) => {
  const { brand } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const scale = useSharedValue(1);
  const favorite = isFavorite(productId);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(1.3, { damping: 8 }, () => {
      scale.value = withSpring(1);
    });
    await toggleFavorite(productId);
  }, [productId, scale, toggleFavorite]);

  return (
    <AnimatedPressable style={[styles.button, animatedStyle]} onPress={() => void handlePress()}>
      <IconButton
        icon={favorite ? 'heart' : 'heart-outline'}
        size={size}
        iconColor={favorite ? brand.brandGold : '#9E9E9E'}
        style={styles.icon}
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: { margin: -8 },
  icon: { margin: 0 },
});
