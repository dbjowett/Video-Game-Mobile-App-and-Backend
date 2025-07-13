import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { SessionProvider } from '@/components/AuthContext';
import { CustomThemeProvider, useTheme } from '@/theme/theme-context';
import { useAppTheme } from '@/theme/useAppTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };
const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { customTheme, navTheme } = useAppTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CustomThemeProvider value={customTheme}>
          <ThemeProvider value={navTheme}>
            <StackScreens />
          </ThemeProvider>
        </CustomThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

const StackScreens = () => {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="games/[id]" />
      <Stack.Screen
        name="(modals)/search"
        options={{ presentation: 'transparentModal' }}
      />
    </Stack>
  );
};
