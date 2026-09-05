// src/theme/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ColorSchemeName,
  StatusBarStyle,
  useColorScheme as useSystemColorScheme,
} from 'react-native';

import useShadows, { ShadowScale } from './hooks/useShadows';
import { darkColors, lightColors, ThemeColors } from './theme';

interface ThemeContextType {
  themeMode: ColorSchemeName; // 'light', 'dark', or null
  colors: ThemeColors;
  setTheme: (mode: ColorSchemeName) => Promise<void>;
  shadows: ShadowScale;
  isDarkMode: boolean;
  statusBarStyle: StatusBarStyle;
}

const THEME_STORAGE_KEY = '@app_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeMode] = useState<ColorSchemeName | 'system'>(
    systemColorScheme || 'light',
  );
  const currentThemeMode = themeMode === 'system' ? systemColorScheme : themeMode;

  const shadows = useShadows(currentThemeMode);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeMode(storedTheme);
        } else {
          setThemeMode(systemColorScheme || 'light');
        }
      } catch {
        setThemeMode(systemColorScheme || 'light'); // Fallback
      }
    };
    void loadThemePreference();
  }, [systemColorScheme]);

  useEffect(() => {
    if (themeMode === 'system') {
      // oxlint-disable-next-line react/set-state-in-effect
      setThemeMode(systemColorScheme || 'light');
    }
  }, [systemColorScheme, themeMode]);

  const currentColors = themeMode === 'dark' ? darkColors : lightColors;
  const isDarkMode = themeMode === 'dark';

  const statusBarStyle: StatusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  const setTheme = useCallback(
    async (mode: ColorSchemeName) => {
      try {
        if (mode === 'light' || mode === 'dark') {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
          setThemeMode(mode);
        } else {
          await AsyncStorage.removeItem(THEME_STORAGE_KEY);
          setThemeMode(systemColorScheme || 'light');
        }
      } catch {
        // Ignore write failures; theme falls back to the in-memory state until next successful save.
      }
    },
    [systemColorScheme],
  );

  const contextValue: ThemeContextType = {
    themeMode: currentThemeMode,
    colors: currentColors,
    shadows,
    setTheme,
    isDarkMode,
    statusBarStyle,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
