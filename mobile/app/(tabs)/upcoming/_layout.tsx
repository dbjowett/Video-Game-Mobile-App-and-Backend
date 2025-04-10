import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Upcoming',
          headerLargeTitle: true,
          // headerBlurEffect: 'light',
          // headerTransparent: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
