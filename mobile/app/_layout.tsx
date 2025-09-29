import { SessionProvider } from '@/components/AuthContext';
import AddToListProvider from '@/providers/AddToListProvider';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useToastConfig } from '@/theme/hooks/useToastConfig';
import {
  ThemeProvider as CustomAppThemeProvider,
  useTheme,
} from '@/theme/theme-context';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '(tabs)' };

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
            <AddToListProvider>
              <StatusBar barStyle={statusBarStyle} />
              <StackScreens />
              <Toast topOffset={60} config={toastConfig} />
            </AddToListProvider>
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
