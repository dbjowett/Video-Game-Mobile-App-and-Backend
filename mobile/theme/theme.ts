import { tailwindColors } from './tailwindColors';

const baseColors = {
  errorRed: tailwindColors.red['600'],
  successGreen: tailwindColors.green['600'],
  warningOrange: tailwindColors.amber['500'],
  infoBlue: tailwindColors.sky['500'],
} as const;

export const lightColors = {
  ...baseColors,

  primary: tailwindColors.blue['600'],
  primaryLight: tailwindColors.blue['400'],
  primaryDark: tailwindColors.blue['800'],

  secondary: tailwindColors.fuchsia['500'],
  secondaryLight: tailwindColors.fuchsia['300'],
  secondaryDark: tailwindColors.fuchsia['700'],

  background: tailwindColors.neutral['50'],
  surface: tailwindColors.neutral['100'],
  card: tailwindColors.neutral['100'],
  textPrimary: tailwindColors.neutral['900'],
  textSecondary: tailwindColors.neutral['700'],
  textDisabled: tailwindColors.neutral['400'],
  textPlaceholder: tailwindColors.neutral['500'],
  border: tailwindColors.neutral['200'],
  divider: tailwindColors.neutral['300'],

  buttonPrimaryBackground: tailwindColors.blue['600'],
  buttonPrimaryText: tailwindColors.neutral['50'],
  buttonSecondaryBackground: tailwindColors.neutral['200'],
  buttonSecondaryText: tailwindColors.neutral['800'],
  buttonOutlineBorder: tailwindColors.blue['400'],

  buttonDisabledBackground: tailwindColors.neutral['200'],
  buttonDisabledText: tailwindColors.neutral['500'],

  textOnPrimary: tailwindColors.neutral['50'],
  textOnSecondary: tailwindColors.neutral['50'],
  textOnError: tailwindColors.neutral['50'],
  textOnSuccess: tailwindColors.neutral['50'],
  textOnWarning: tailwindColors.neutral['900'],
  textOnInfo: tailwindColors.neutral['50'],

  shadowColor: tailwindColors.neutral['900'],
} as const;

export const darkColors = {
  ...baseColors,

  primary: tailwindColors.blue['400'],
  primaryLight: tailwindColors.blue['300'],
  primaryDark: tailwindColors.blue['600'],

  secondary: tailwindColors.fuchsia['300'],
  secondaryLight: tailwindColors.fuchsia['200'],
  secondaryDark: tailwindColors.fuchsia['500'],

  background: tailwindColors.neutral['950'],
  surface: tailwindColors.neutral['900'],
  card: tailwindColors.neutral['900'],
  textPrimary: tailwindColors.neutral['50'],
  textSecondary: tailwindColors.neutral['300'],
  textDisabled: tailwindColors.neutral['600'],
  textPlaceholder: tailwindColors.neutral['500'],
  border: tailwindColors.neutral['800'],
  divider: tailwindColors.neutral['700'],

  buttonPrimaryBackground: tailwindColors.blue['400'],
  buttonPrimaryText: tailwindColors.neutral['950'],
  buttonSecondaryBackground: tailwindColors.neutral['700'],
  buttonSecondaryText: tailwindColors.neutral['50'],
  buttonOutlineBorder: tailwindColors.blue['300'],

  buttonDisabledBackground: tailwindColors.neutral['800'],
  buttonDisabledText: tailwindColors.neutral['600'],

  textOnPrimary: tailwindColors.neutral['950'],
  textOnSecondary: tailwindColors.neutral['950'],
  textOnError: tailwindColors.neutral['50'],
  textOnSuccess: tailwindColors.neutral['50'],
  textOnWarning: tailwindColors.neutral['950'],
  textOnInfo: tailwindColors.neutral['50'],

  shadowColor: tailwindColors.neutral['50'],
} as const;

export type ThemeColors = typeof lightColors;

export const colorSchemes = {
  light: lightColors,
  dark: darkColors,
};
