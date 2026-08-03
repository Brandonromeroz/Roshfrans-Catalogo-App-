import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, RadioButton, Switch, Text } from 'react-native-paper';
import { Header, SectionTitle } from '@/components';
import { useSettingsStore, type ThemeMode } from '@/store/settingsStore';
import { useAppTheme } from '@/theme/useAppTheme';
import { spacing } from '@/theme/spacing';
import Constants from 'expo-constants';

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string }[] = [
  { value: 'system', label: 'Automático', description: 'Sigue la configuración del dispositivo' },
  { value: 'light', label: 'Claro', description: 'Fondo claro, textos oscuros' },
  { value: 'dark', label: 'Oscuro', description: 'Fondo oscuro, textos claros' },
];

export default function SettingsScreen() {
  const { colors, brand } = useAppTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const showSearchHistory = useSettingsStore((s) => s.showSearchHistory);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setShowSearchHistory = useSettingsStore((s) => s.setShowSearchHistory);

  const handleThemeChange = useCallback(
    (mode: ThemeMode) => {
      void setThemeMode(mode);
    },
    [setThemeMode],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screen }]} edges={['top']}>
      <Header subtitle="Personaliza tu experiencia" />

      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle title="Apariencia" subtitle="Tema de la aplicación" />

        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <RadioButton.Group
            onValueChange={(v) => handleThemeChange(v as ThemeMode)}
            value={themeMode}
          >
            {THEME_OPTIONS.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                description={option.description}
                titleStyle={{ color: colors.cardText, fontWeight: '600' }}
                descriptionStyle={{ color: colors.cardTextSecondary }}
                left={() => (
                  <RadioButton
                    value={option.value}
                    color={brand.brandGold}
                    uncheckedColor={colors.cardTextMuted}
                  />
                )}
                onPress={() => handleThemeChange(option.value)}
                style={styles.listItem}
              />
            ))}
          </RadioButton.Group>
        </View>

        <SectionTitle title="Búsqueda" />

        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <List.Item
            title="Historial de búsqueda"
            description="Mostrar búsquedas recientes en el catálogo"
            titleStyle={{ color: colors.cardText, fontWeight: '600' }}
            descriptionStyle={{ color: colors.cardTextSecondary }}
            right={() => (
              <Switch
                value={showSearchHistory}
                onValueChange={(v) => void setShowSearchHistory(v)}
                color={brand.brandGold}
              />
            )}
          />
        </View>

        <SectionTitle title="Acerca de" />

        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <List.Item
            title="Roshfrans Buscador"
            description={`Versión ${Constants.expoConfig?.version ?? '1.0.0'} · Catálogo de lubricantes`}
            titleStyle={{ color: colors.cardText, fontWeight: '600' }}
            descriptionStyle={{ color: colors.cardTextSecondary }}
            left={(props) => (
              <List.Icon {...props} icon="information-outline" color={brand.brandGold} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxxl },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  listItem: {
    paddingVertical: spacing.xs,
  },
});
