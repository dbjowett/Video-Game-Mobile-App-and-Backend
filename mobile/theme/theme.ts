import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    buttonBackground: '#007bff',
    buttonText: '#ffffff',
    background: '#fff',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    buttonBackground: '#1f6feb',
    buttonText: '#ffffff',
  },
};

export type AppTheme = typeof lightTheme;
