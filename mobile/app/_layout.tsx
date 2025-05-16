import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { SessionProvider } from '@/components/AuthContext';
import { useColourScheme } from '@/components/useColourScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };
const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colourScheme = useColourScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider value={colourScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StackScreens />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

const StackScreens = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // contentStyle: { backgroundColor: '#FDFFFF' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="games/[id]" />

      <Stack.Screen
        name="(modals)/search"
        options={{
          presentation: 'transparentModal',
        }}
      />
    </Stack>
  );
};
