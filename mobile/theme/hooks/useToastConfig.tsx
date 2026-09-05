import React from 'react';
import { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

import { spacing } from '../constants/spacing';
import { useTheme } from '../ThemeContext';

export const useToastConfig = () => {
  const { colors } = useTheme();
  return {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.successGreen,
          backgroundColor: colors.surface,
        }}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        text1Style={{
          color: colors.textPrimary,
          fontSize: 16,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.errorRed,
          backgroundColor: colors.surface,
        }}
        text1Style={{
          color: colors.textPrimary,
          fontSize: 16,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
  };
};
