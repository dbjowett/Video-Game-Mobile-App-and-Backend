import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Upcoming Releases',
          // headerLargeTitle: true,
          // headerBlurEffect: 'light',
          // headerTransparent: true,
          headerShadowVisible: false,
          // headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
