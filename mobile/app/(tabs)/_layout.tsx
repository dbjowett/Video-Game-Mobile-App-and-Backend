import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { useSession } from '@/components/AuthContext';
import { AppText } from '@/components/Themed';
import { useTheme } from '@/theme/theme-context';
import { CalendarClock, List, Search, User } from 'lucide-react-native';

interface IconProps {
  color: string;
  size: string;
}

export default function TabLayout() {
  const { isLoading, isLoggedIn } = useSession();
  const { colors } = useTheme();

  if (isLoading) {
    return <AppText>Loading...</AppText>;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }: IconProps) => (
            <Search size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upcoming"
        options={{
          title: 'Upcoming',
          tabBarLabel: 'Upcoming',
          tabBarIcon: ({ color, size }: IconProps) => (
            <CalendarClock size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="gamelist"
        options={{
          title: 'Game Lists',
          tabBarLabel: 'Lists',
          tabBarIcon: ({ color, size }: IconProps) => (
            <List size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: IconProps) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
