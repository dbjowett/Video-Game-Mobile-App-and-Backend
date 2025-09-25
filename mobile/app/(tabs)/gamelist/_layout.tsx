import { useTheme } from '@/theme/theme-context';
import { Stack } from 'expo-router';

const Layout = () => {
  const { colors } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Game Lists',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          // headerBlurEffect: 'light',
          // headerTransparent: true,
        }}
      />
    </Stack>
  );
};

export default Layout;
