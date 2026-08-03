import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { highlightSearch } from '@/utils/text.utils';
import type { Product } from '@/features/products/types/product.types';
import { useAppTheme } from '@/theme/useAppTheme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface ProductCardProps {
  product: Product;
  searchQuery?: string;
  index?: number;
  onPress: (product: Product) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, searchQuery, index = 0, onPress }) => {
    const { colors, brand } = useAppTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.97, { damping: 12, stiffness: 200 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, [scale]);

    const renderText = (
      text: string,
      style: object,
      variant: 'titleSmall' | 'bodySmall' | 'labelSmall' = 'bodySmall',
    ) => {
      const segments = highlightSearch(text, searchQuery ?? '');
      return (
        <Text variant={variant} style={style}>
          {segments.map((segment, i) => (
            <Text
              key={`${segment.text}-${i}`}
              style={
                segment.highlighted
                  ? {
                      backgroundColor: colors.highlight,
                      color: colors.highlightText,
                      fontWeight: '700',
                    }
                  : undefined
              }
            >
              {segment.text}
            </Text>
          ))}
        </Text>
      );
    };

    return (
      <Animated.View entering={FadeInRight.delay(Math.min(index * 40, 400)).springify()}>
        <AnimatedPressable
          onPress={() => onPress(product)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.wrapper, animatedStyle]}
        >
          <View
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={[styles.goldStripe, { backgroundColor: brand.brandGold }]} />
            <View style={styles.cardBody}>
              <View style={styles.brandRow}>
                <View style={[styles.marcaBadge, { backgroundColor: brand.brandBlack }]}>
                  <Text variant="labelMedium" style={{ color: brand.brandGold, fontWeight: '700' }}>
                    {product.marca}
                  </Text>
                </View>
                <FavoriteButton productId={product.id} size={22} />
              </View>

              {renderText(
                product.productoOriginal,
                [styles.productName, { color: colors.cardText }],
                'titleSmall',
              )}

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              <Text
                variant="labelSmall"
                style={[styles.equivalentLabel, { color: colors.cardTextMuted }]}
              >
                Recomendación Roshfrans
              </Text>
              {renderText(product.productoEquivalente, [
                styles.equivalentText,
                { color: colors.cardTextSecondary },
              ])}

              {product.aplicacion ? (
                <View
                  style={[
                    styles.aplicacionBadge,
                    { backgroundColor: colors.equivalentBg, borderColor: colors.equivalentBorder },
                  ]}
                >
                  {renderText(
                    product.aplicacion,
                    [styles.aplicacionText, { color: colors.cardTextSecondary }],
                    'labelSmall',
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  },
);

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goldStripe: { width: 4 },
  cardBody: { flex: 1, padding: spacing.md, gap: spacing.sm },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marcaBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    maxWidth: '80%',
  },
  productName: { fontWeight: '700', lineHeight: 22 },
  divider: { height: 1, marginVertical: 2 },
  equivalentLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  equivalentText: { lineHeight: 18 },
  aplicacionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  aplicacionText: { flexShrink: 1 },
});
