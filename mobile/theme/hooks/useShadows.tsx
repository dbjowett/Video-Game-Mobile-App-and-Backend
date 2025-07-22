import { ColorSchemeName, ViewStyle } from 'react-native';
import { darkColors, lightColors } from '../theme';

export type ShadowLevel = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ShadowScale = Record<ShadowLevel, ViewStyle>;

export default function useShadows(theme: ColorSchemeName): ShadowScale {
  const colors = theme === 'light' ? lightColors : darkColors;

  const shadows = {
    xs: {
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.02,
      shadowRadius: 0.5,
      shadowOffset: { width: 0, height: 1 },
      elevation: 0.5,
    },
    sm: {
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.05,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    md: {
      shadowColor: colors.shadowColor,
      shadowOpacity: theme === 'light' ? 0.1 : 0.08,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    lg: {
      shadowColor: colors.shadowColor,
      shadowOpacity: theme === 'light' ? 0.1 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    xl: {
      shadowColor: colors.shadowColor,
      shadowOpacity: theme === 'light' ? 0.12 : 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
  };

  return shadows;
}
