import { useUser } from '@/api/hooks/useUser';
import { AppText } from '@/components/Themed';
import { spacing } from '@/theme/constants/spacing';
import { StyleSheet, View } from 'react-native';

export default function Page() {
  const { data: user } = useUser();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.contentContainer}>
        <View style={styles.sectionContainer}>
          <AppText>Username</AppText>
          <AppText>{user?.username}</AppText>
        </View>

        <View style={styles.sectionContainer}>
          <AppText>Email</AppText>

          <AppText>{user?.email}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: spacing.md,
  },
  sectionContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
