/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useTheme } from '@/theme/theme-context';
import { Text as DefaultText, View as DefaultView } from 'react-native';

type ThemeProps = {
  lightColour?: string;
  darkColour?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const { textColor } = useTheme();

  return <DefaultText style={[{ color: textColor }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColour, darkColour, ...otherProps } = props;
  const { backgroundColor } = useTheme();

  return (
    <DefaultView
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
