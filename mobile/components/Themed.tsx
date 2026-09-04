/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';

import { useTheme } from '@/theme/theme-context';

type ThemeProps = {
  lightColour?: string;
  darkColour?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function AppText(props: TextProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const { colors } = useTheme();

  return <DefaultText style={[{ color: colors.textPrimary }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const { colors } = useTheme();

  return <DefaultView style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
