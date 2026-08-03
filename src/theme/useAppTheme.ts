import { useColorScheme } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BRAND } from './brand';
import { darkColors, lightColors } from './colors';

export interface AppThemeColors {
  screen: string;
  card: string;
  cardText: string;
  cardTextSecondary: string;
  cardTextMuted: string;
  cardBorder: string;
  sectionTitle: string;
  sectionSubtitle: string;
  headerBg: string;
  searchBg: string;
  searchBorder: string;
  searchText: string;
  searchPlaceholder: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
  highlight: string;
  highlightText: string;
  chipBg: string;
  chipText: string;
  footerText: string;
  footerMuted: string;
  progressTrack: string;
  equivalentBg: string;
  equivalentBorder: string;
  divider: string;
  detailHeaderText: string;
  statusBar: 'light' | 'dark';
}

const buildSemanticColors = (isDark: boolean): AppThemeColors => ({
  screen: isDark ? '#0D0D0D' : '#F2F2F2',
  card: isDark ? '#1F1F1F' : '#FFFFFF',
  cardText: isDark ? '#FFFFFF' : '#111111',
  cardTextSecondary: isDark ? '#D4D4D4' : '#444444',
  cardTextMuted: isDark ? '#9CA3AF' : '#6B7280',
  cardBorder: isDark ? '#333333' : '#E5E5E5',
  sectionTitle: isDark ? '#FFFFFF' : '#111111',
  sectionSubtitle: isDark ? '#A3A3A3' : '#666666',
  headerBg: BRAND.black,
  searchBg: isDark ? '#1A1A1A' : '#FFFFFF',
  searchBorder: isDark ? '#404040' : '#D4D4D4',
  searchText: isDark ? '#FFFFFF' : '#111111',
  searchPlaceholder: '#9CA3AF',
  tabBar: BRAND.black,
  tabActive: BRAND.gold,
  tabInactive: '#737373',
  highlight: BRAND.gold,
  highlightText: BRAND.black,
  chipBg: isDark ? '#262626' : '#F5F5F5',
  chipText: isDark ? BRAND.gold : '#111111',
  footerText: isDark ? '#E5E5E5' : '#333333',
  footerMuted: isDark ? '#9CA3AF' : '#737373',
  progressTrack: isDark ? '#333333' : '#E5E5E5',
  equivalentBg: isDark ? '#2A2410' : '#FFFBEB',
  equivalentBorder: BRAND.gold,
  divider: isDark ? '#333333' : '#EEEEEE',
  detailHeaderText: '#FFFFFF',
  statusBar: 'light',
});

export const brandPalette = {
  brandBlack: BRAND.black,
  brandGold: BRAND.gold,
} as const;

export const useAppTheme = () => {
  const paperTheme = useTheme();
  const systemScheme = useColorScheme();
  const isDark = paperTheme.dark ?? systemScheme === 'dark';
  const palette = isDark ? darkColors : lightColors;

  return {
    isDark,
    brand: brandPalette,
    colors: buildSemanticColors(isDark),
    paper: palette,
  };
};
