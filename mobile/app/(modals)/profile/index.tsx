import { useUser } from '@/api/hooks/useUser';
import AppButton from '@/components/AppButton';
import { useSession } from '@/components/AuthContext';
import { AppText, View } from '@/components/Themed';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

const formatDate = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getInitials = (username?: string) => {
  if (!username) return '?';
  return username.trim().slice(0, 2).toUpperCase();
};

export default function Page() {
  const { data: user, isLoading } = useUser();
  const { signOut } = useSession();
  const { colors, shadows } = useTheme();
  const headerHeight = useHeaderHeight();

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingWrapper}>
        <AppText>Unable to load profile.</AppText>
      </View>
    );
  }

  const joinedLabel = formatDate(user.createdAt);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: headerHeight + spacing.md },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.heroCard,
          shadows.md,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.avatarWrap,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primaryLight,
            },
          ]}
        >
          <AppText style={[styles.avatarText, { color: colors.textOnPrimary }]}>
            {getInitials(user.username)}
          </AppText>
        </View>

        <View style={styles.heroTextBlock}>
          <AppText style={styles.username}>{user.username}</AppText>
          <AppText style={[styles.email, { color: colors.textSecondary }]}>
            {user.email}
          </AppText>
        </View>

        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ShieldCheck size={14} color={colors.primary} />
            <AppText style={styles.badgeText}>Account active</AppText>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <UserRound size={18} color={colors.primary} />
          </View>
          <View style={styles.infoTextBlock}>
            <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Username
            </AppText>
            <AppText style={styles.infoValue}>{user.username}</AppText>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Mail size={18} color={colors.primary} />
          </View>
          <View style={styles.infoTextBlock}>
            <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Email
            </AppText>
            <AppText style={styles.infoValue}>{user.email}</AppText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <AppText style={styles.summaryTitle}>Profile</AppText>
        <AppText style={[styles.summaryText, { color: colors.textSecondary }]}>
          {joinedLabel ? `Member since ${joinedLabel}` : 'Signed in account'}
        </AppText>
      </View>

      <AppButton
        title="Sign Out"
        onPress={signOut}
        variant="dark"
        rightIcon="LogOut"
        style={styles.signOutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  heroTextBlock: {
    gap: spacing.xs,
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
  },
  email: {
    fontSize: 15,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoSection: {
    gap: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  infoTextBlock: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: spacing.sm,
  },
});
