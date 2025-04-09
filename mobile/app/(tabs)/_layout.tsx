import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { useSession } from '@/components/AuthContext';
import { useColours } from '@/hooks/useColours';
import { CalendarClock, Heart, Search, User } from 'lucide-react-native';
import { Text } from 'react-native';

interface IconProps {
  color: string;
  size: string;
}

export default function TabLayout() {
  const { isLoading, session } = useSession();
  const colours = useColours();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colours.tabIconSelected }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }: IconProps) => <Search size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="upcoming"
        options={{
          title: 'Upcoming',
          tabBarLabel: 'Upcoming',
          tabBarIcon: ({ color, size }: IconProps) => <CalendarClock size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          // headerShown: false,
          title: 'Wishlist',
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, size }: IconProps) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }: IconProps) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
