import { createContext, useContext } from 'react';
import { lightTheme } from './theme';

const ThemeContext = createContext(lightTheme);
export const useTheme = () => useContext(ThemeContext);
export const CustomThemeProvider = ThemeContext.Provider;
