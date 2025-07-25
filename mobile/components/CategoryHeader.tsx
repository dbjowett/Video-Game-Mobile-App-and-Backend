import { useUser } from '@/api/hooks/useUser';
import { useTheme } from '@/theme/theme-context';
import { Link } from 'expo-router';

import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { Search } from 'lucide-react-native';
import { AppText } from './Themed';

const LandingHeader = () => {
  const { data: user } = useUser();

  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/search'} asChild>
            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.searchBtn,
                { borderColor: colors.border },
              ])}
            >
              <Search size={20} color={colors.textPrimary} />
              <View>
                <AppText style={{ fontWeight: 600 }}>Search</AppText>
                <AppText style={{ color: colors.textSecondary }}>
                  Find your new favourite
                </AppText>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity>
            <Image
              source={{ uri: user?.profileImage }} // Use the user's profile image or a default one
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 68,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: '#c2c2c2',
    borderColor: '#c2c2c2',
    borderWidth: 1,

    // elevation: 2,
    // shadowColor: '#000',
    // shadowOpacity: 0.12,
    // shadowOffset: {
    //   width: 1,
    //   height: 1,
    // },
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    flex: 1,
    padding: 14,
    borderRadius: radius.round,
  },
});

export default LandingHeader;
