import { DarkTheme, DefaultTheme } from '@react-navigation/native';

interface CustomTheme extends DefaultTheme {
  colors: {
    buttonBackground: string;
    buttonText: string;
    background: string;
    text: string;
    textSecondary: string;
    surface: string;
    border: string;
    borderDark: string;
    primary: string;
    secondary?: string;
  };
}

export const lightTheme: CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    surface: '#F2F2F7',

    primary: '#007bff',

    buttonBackground: '#007bff',
    buttonText: '#ffffff',

    text: '#1C1C1E',
    textSecondary: '#6e6e73',

    border: '#D1D5DB',
    borderDark: '#9CA3AF',
  },
};

export const darkTheme: CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    surface: '#1E1E1E',

    primary: '#1f6feb',

    buttonBackground: '#1f6feb',
    buttonText: '#ffffff',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#3F3F46',
    borderDark: '	#52525B',
  },
};

export type AppTheme = typeof lightTheme;
