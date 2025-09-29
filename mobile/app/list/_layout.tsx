import { useTheme } from '@/theme/theme-context';
import { router, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function Layout() {
  const { colors } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          ),

          headerTitle: 'Games',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack>
  );
}
