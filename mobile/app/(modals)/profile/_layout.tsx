import { router, Stack } from 'expo-router';
import { XIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const handlePress = () => router.back();

export const GoBackBtn = () => (
  <TouchableOpacity onPress={handlePress}>
    <XIcon size={28} color="black" />
  </TouchableOpacity>
);

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
          headerTransparent: true,
          presentation: 'transparentModal',
          animation: 'fade',
          headerLeft: () => <GoBackBtn />,
        }}
      />
    </Stack>
  );
};

export default Layout;
