import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { logoHeader } from '@/assets/images';
import { BrandAccent } from '@/components/BrandAccent';
import { useAppTheme } from '@/theme/useAppTheme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface OnboardingModalProps {
  visible: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    icon: '📋',
    title: 'Explora el catálogo',
    description:
      'Desplázate para ver todos los lubricantes y especialidades sin necesidad de buscar.',
  },
  {
    icon: '🏷️',
    title: 'Filtra por marca',
    description:
      'Usa los chips de marcas para encontrar productos de Shell, Mobil, Roshfrans y más.',
  },
  {
    icon: '🔍',
    title: 'Busca al instante',
    description:
      'Escribe marca, producto original, equivalente o aplicación para resultados rápidos.',
  },
  {
    icon: '❤️',
    title: 'Guarda favoritos',
    description:
      'Toca el corazón en cualquier producto para acceder después desde la pestaña Favoritos.',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onComplete }) => {
  const { colors, brand } = useAppTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={[styles.header, { backgroundColor: brand.brandBlack }]}>
            <Image source={logoHeader} style={styles.logo} resizeMode="contain" />
            <Text variant="titleMedium" style={styles.welcome}>
              Bienvenido
            </Text>
            <BrandAccent height={2} />
          </View>

          <View style={styles.content}>
            {STEPS.map((step, index) => (
              <Animated.View
                key={step.title}
                entering={FadeInDown.delay(index * 100).springify()}
                style={styles.step}
              >
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <View style={styles.stepText}>
                  <Text variant="titleSmall" style={[styles.stepTitle, { color: colors.cardText }]}>
                    {step.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.cardTextSecondary }}>
                    {step.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={onComplete}
            buttonColor={brand.brandGold}
            textColor={brand.brandBlack}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Comenzar
          </Button>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 200,
    height: 50,
  },
  welcome: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  stepIcon: {
    fontSize: 24,
    width: 32,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontWeight: '700',
  },
  button: {
    margin: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: radius.md,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
});
