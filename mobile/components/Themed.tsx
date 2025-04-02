/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '@/constants/Colours';
import { useColourScheme } from './useColourScheme';

type ThemeProps = {
  lightColour?: string;
  darkColour?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColour(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColourScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const colour = useThemeColour({ light: lightColour, dark: darkColour }, 'text');

  return <DefaultText style={[{ color: colour }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const backgroundColour = useThemeColour({ light: lightColour, dark: darkColour }, 'background');

  return <DefaultView style={[{ backgroundColor: backgroundColour }, style]} {...otherProps} />;
}
