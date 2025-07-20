import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { spacing } from './spacing';
import { useTheme } from './theme-context';

export const useToastConfig = () => {
  const { colors } = useTheme();
  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.primary,
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
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          color: colors.textPrimary,
          borderLeftColor: colors.errorRed,
          backgroundColor: colors.surface,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
    // tomatoToast: ({ text1, props }: any) => (
    //   <View
    //     style={{
    //       height: 60,
    //       width: '100%',
    //       backgroundColor: 'tomato',
    //       padding: 10,
    //     }}
    //   >
    //     <Text style={{ color: '#fff', fontWeight: 'bold' }}>{text1}</Text>
    //     <Text style={{ color: '#fff' }}>{props?.uuid}</Text>
    //   </View>
    // ),
  };
};
