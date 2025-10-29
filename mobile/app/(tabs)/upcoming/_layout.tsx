import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Upcoming Releases',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
