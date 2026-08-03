import { MD3DarkTheme, MD3LightTheme, configureFonts, type MD3Theme } from 'react-native-paper';
import { darkColors, lightColors } from './colors';
import { radius } from './radius';
import { typography } from './typography';

const fontConfig = {
  fontFamily: typography.fontFamily.regular,
};

const baseLightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: radius.md,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    primaryContainer: lightColors.primaryContainer,
    onPrimaryContainer: lightColors.onPrimaryContainer,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    secondaryContainer: lightColors.secondaryContainer,
    onSecondaryContainer: lightColors.onSecondaryContainer,
    background: lightColors.background,
    onBackground: lightColors.onBackground,
    surface: lightColors.surface,
    onSurface: lightColors.onSurface,
    surfaceVariant: lightColors.surfaceVariant,
    onSurfaceVariant: lightColors.onSurfaceVariant,
    outline: lightColors.outline,
    outlineVariant: lightColors.outlineVariant,
    error: lightColors.error,
    onError: lightColors.onError,
    elevation: lightColors.elevation,
  },
  fonts: configureFonts({ config: fontConfig }),
};

const baseDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: radius.md,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    surface: darkColors.surface,
    onSurface: darkColors.onSurface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    outline: darkColors.outline,
    outlineVariant: darkColors.outlineVariant,
    error: darkColors.error,
    onError: darkColors.onError,
    elevation: darkColors.elevation,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const lightTheme = baseLightTheme;
export const darkTheme = baseDarkTheme;

export const appTheme = {
  light: lightTheme,
  dark: darkTheme,
  colors: {
    light: lightColors,
    dark: darkColors,
  },
};

export type AppTheme = typeof appTheme;
