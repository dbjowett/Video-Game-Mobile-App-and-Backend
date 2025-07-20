import * as LucideIcons from 'lucide-react-native';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { ViewStyle } from 'react-native';

type LucideIconComponent = React.ForwardRefExoticComponent<
  LucideProps & React.RefAttributes<any>
>;

export type LucideIconName = keyof typeof LucideIcons;

interface IconRendererProps {
  name: LucideIconName; // Now this type is more precise
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  size = 20,
  color,
  style,
}) => {
  const IconComponent = LucideIcons[name] as LucideIconComponent | undefined;

  if (!IconComponent) {
    console.warn(
      `Lucide icon '${name}' not found or is not a valid icon component.`,
    );
    return null;
  }

  return <IconComponent size={size} color={color} style={style} />;
};

export default IconRenderer;
