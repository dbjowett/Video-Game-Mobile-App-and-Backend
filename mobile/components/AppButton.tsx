import { Radius, radius } from '@/theme/constants/radius'; // Border radius constants
import { spacing } from '@/theme/constants/spacing'; // Spacing constants
import { useTheme } from '@/theme/theme-context'; // Your custom theme hook
import IconRenderer, { LucideIconName } from '@/utils/IconRenderer'; // Icon utility
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

// --- Type Definitions ---
type ButtonVariant = 'default' | 'outline' | 'subtle' | 'destructive' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonFontSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fontSize?: ButtonFontSize;
  borderRadius?: Radius;
  leftIcon?: LucideIconName;
  rightIcon?: LucideIconName;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean; // New prop for loading state
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'default',
  size = 'md',
  fontSize = 'md',
  borderRadius = 'sm',
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const { colors, isDarkMode } = useTheme();

  const getButtonStyles = React.useMemo(() => {
    const baseButton: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius[borderRadius],
      overflow: 'hidden',
    };

    const baseText: TextStyle = {
      fontWeight: 'bold',
      textAlign: 'center',
    };

    const baseIconSize = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    const basePadding = {
      sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      },
      md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
      lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
      },
    };

    const baseFontSize = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    // Variant-specific styles
    let variantButton: ViewStyle = {};
    let variantText: TextStyle = {};
    let variantIconColor: string = colors.textPrimary;

    switch (variant) {
      case 'default':
        variantButton = {
          backgroundColor: colors.buttonPrimaryBackground,
        };
        variantText = {
          color: colors.buttonPrimaryText,
        };
        variantIconColor = colors.buttonPrimaryText;
        break;
      case 'dark':
        variantButton = {
          backgroundColor: colors.buttonContrastBackground,
        };
        variantText = {
          color: colors.buttonContrastText,
        };
        variantIconColor = colors.buttonContrastText;
        break;
      case 'outline':
        variantButton = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.buttonOutlineBorder,
        };
        variantText = {
          color: colors.primary,
        };
        variantIconColor = colors.primary;
        break;
      case 'subtle':
        variantButton = {
          backgroundColor: isDarkMode ? colors.surface : colors.background, // Lighter background for subtle
          opacity: 0.9, // Slightly transparent
        };
        variantText = {
          color: colors.textPrimary, // Subtle text usually primary text color
        };
        variantIconColor = colors.textPrimary;
        break;
      case 'destructive':
        variantButton = {
          backgroundColor: colors.errorRed,
        };
        variantText = {
          color: colors.textOnError,
        };
        variantIconColor = colors.textOnError;
        break;
    }

    // Disabled state overrides
    if (disabled || loading) {
      variantButton = {
        ...variantButton,
        backgroundColor: colors.buttonDisabledBackground,
        borderColor: colors.buttonDisabledBackground, // For outline variant
      };
      variantText = {
        ...variantText,
        color: colors.buttonDisabledText,
      };
      variantIconColor = colors.buttonDisabledText;
    }

    return StyleSheet.create({
      button: {
        ...baseButton,
        ...basePadding[size],
        ...variantButton,
      },
      text: {
        ...baseText,
        fontSize: baseFontSize[fontSize],
        ...variantText,
      },
      icon: {
        color: variantIconColor,
        fontSize: baseIconSize[size], // Use icon size based on button size
      },
      leftIconSpacing: {
        marginRight: spacing.xs,
      },
      rightIconSpacing: {
        marginLeft: spacing.xs,
      },
    });
  }, [
    colors,
    isDarkMode,
    variant,
    size,
    fontSize,
    borderRadius,
    disabled,
    loading,
  ]);

  return (
    <TouchableOpacity
      style={[getButtonStyles.button, style]}
      onPress={onPress}
      disabled={disabled || loading} // Disable if loading
      activeOpacity={0.7} // Standard for touchable elements
    >
      {loading ? (
        <ActivityIndicator
          size={getButtonStyles.icon.fontSize}
          color={getButtonStyles.icon.color}
        />
      ) : (
        <>
          {leftIcon && (
            <IconRenderer
              name={leftIcon}
              size={getButtonStyles.icon.fontSize}
              color={getButtonStyles.icon.color}
              style={getButtonStyles.leftIconSpacing}
            />
          )}
          <Text style={[getButtonStyles.text, textStyle]}>{title}</Text>
          {rightIcon && (
            <IconRenderer
              name={rightIcon}
              size={getButtonStyles.icon.fontSize}
              color={getButtonStyles.icon.color}
              style={getButtonStyles.rightIconSpacing}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
