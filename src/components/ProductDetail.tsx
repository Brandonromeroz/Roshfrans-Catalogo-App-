import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { FavoriteButton } from '@/components/FavoriteButton';
import { BrandAccent } from '@/components/BrandAccent';
import { highlightSearch } from '@/utils/text.utils';
import { getProductDisplayFields } from '@/utils/formatProduct';
import type { Product } from '@/features/products/types/product.types';
import { useAppTheme } from '@/theme/useAppTheme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface ProductDetailProps {
  product: Product;
  searchQuery?: string;
}

const DetailField: React.FC<{
  label: string;
  value: string;
  query?: string;
  isPrimary?: boolean;
  index: number;
}> = ({ label, value, query, isPrimary = false, index }) => {
  const { colors, brand } = useAppTheme();
  const segments = highlightSearch(value, query ?? '');

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={[
        styles.field,
        isPrimary && [styles.primaryField, { backgroundColor: colors.equivalentBg }],
      ]}
    >
      <Text variant="labelMedium" style={[styles.fieldLabel, { color: colors.cardTextMuted }]}>
        {label}
      </Text>
      <Text
        variant={isPrimary ? 'titleMedium' : 'bodyLarge'}
        style={{ color: colors.cardText, lineHeight: 24 }}
      >
        {segments.map((segment, i) => (
          <Text
            key={`${segment.text}-${i}`}
            style={
              segment.highlighted
                ? { backgroundColor: brand.brandGold, color: brand.brandBlack, fontWeight: '700' }
                : undefined
            }
          >
            {segment.text}
          </Text>
        ))}
      </Text>
    </Animated.View>
  );
};

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, searchQuery }) => {
  const { colors, brand } = useAppTheme();
  const fields = getProductDisplayFields(product);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.duration(500)}
        style={[styles.headerCard, { backgroundColor: brand.brandBlack }]}
      >
        <View style={styles.headerTop}>
          <View style={[styles.marcaBadge, { backgroundColor: brand.brandGold }]}>
            <Text variant="labelLarge" style={{ color: brand.brandBlack, fontWeight: '800' }}>
              {product.marca}
            </Text>
          </View>
          <FavoriteButton productId={product.id} size={28} />
        </View>
        <Text
          variant="headlineSmall"
          style={[styles.headerTitle, { color: colors.detailHeaderText }]}
        >
          {product.productoOriginal}
        </Text>
        <BrandAccent height={2} />
      </Animated.View>

      <View
        style={[
          styles.detailsCard,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}
      >
        {fields.map((field, index) => (
          <React.Fragment key={field.key}>
            {index > 0 ? (
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            ) : null}
            <DetailField
              label={field.label}
              value={field.value}
              query={searchQuery}
              isPrimary={field.key === 'productoEquivalente'}
              index={index}
            />
          </React.Fragment>
        ))}
      </View>

      <Text variant="bodySmall" style={{ color: colors.footerMuted, textAlign: 'center' }}>
        Producto #{product.id} · Roshfrans
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  headerCard: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, overflow: 'hidden' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marcaBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  headerTitle: { fontWeight: '700', lineHeight: 32 },
  detailsCard: { borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1 },
  field: { gap: spacing.xs, paddingVertical: spacing.sm },
  primaryField: {
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  fieldLabel: { fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 },
  divider: { height: 1, marginVertical: spacing.xs },
});
