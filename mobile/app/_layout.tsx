import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { SessionProvider } from '@/components/AuthContext';
import {
  ThemeProvider as CustomAppThemeProvider,
  useTheme,
} from '@/theme/theme-context';
import { useAppTheme } from '@/theme/useAppTheme';
import { useToastConfig } from '@/theme/useToastConfig';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };
const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CustomAppThemeProvider>
      <RootLayoutContent />
    </CustomAppThemeProvider>
  );
}

const RootLayoutContent = () => {
  const { statusBarStyle } = useTheme();
  const { navTheme } = useAppTheme();
  const toastConfig = useToastConfig();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NavigationThemeProvider value={navTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle={statusBarStyle} />
            <StackScreens />
            <Toast topOffset={60} config={toastConfig} />
          </GestureHandlerRootView>
        </NavigationThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

const StackScreens = () => {
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
