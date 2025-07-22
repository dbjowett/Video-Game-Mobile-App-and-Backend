// src/theme/useAppTheme.ts
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useMemo } from 'react';
import { useTheme } from '../theme-context';

export const useAppTheme = () => {
  const { colors, isDarkMode } = useTheme();

  const navTheme = useMemo(() => {
    return {
      ...DefaultTheme,
      dark: isDarkMode,
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.errorRed,
      },
    };
  }, [colors, isDarkMode]);

  const customTheme = colors;

  return { customTheme, navTheme };
};
