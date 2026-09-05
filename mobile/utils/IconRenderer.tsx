import * as LucideIcons from 'lucide-react-native';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { ViewStyle } from 'react-native';

type LucideIconComponent = React.ForwardRefExoticComponent<
  LucideProps & React.RefAttributes<SVGSVGElement>
>;

export type LucideIconName = keyof typeof LucideIcons;

interface IconRendererProps {
  name: LucideIconName; // Now this type is more precise
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const IconRenderer: React.FC<IconRendererProps> = ({ name, size = 20, color, style }) => {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- dynamic icon lookup
  const IconComponent = LucideIcons[name] as LucideIconComponent | undefined;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} style={style} />;
};

export default IconRenderer;
