import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './theme';

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return {
    customTheme: theme,
    navTheme: theme,
  };
};
