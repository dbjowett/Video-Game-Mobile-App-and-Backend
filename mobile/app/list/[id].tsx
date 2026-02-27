import { useGetListsGames } from '@/api/hooks/useGetListsGames';
import { GameListItem } from '@/api/types/game-list';
import { IgdbImage } from '@/components/IgdbImage';
import { AppText } from '@/components/Themed';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const Page = () => {
  const { id: gameListId } = useLocalSearchParams<{ id: string }>();
  const { colors, shadows } = useTheme();
  const { data: games, isLoading } = useGetListsGames(gameListId);

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!games) {
    router.back();
    return null;
  }

  const renderGameItem = ({ item: gameItem }: { item: GameListItem }) => {
    const { createdAt, updatedAt, gameId, gameTitle, position, gameCoverUrl } =
      gameItem;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.gameItem,
          shadows.sm,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
        onPress={() => {
          router.push(`/games/${gameId}`);
        }}
      >
        <View style={styles.gameContent}>
          <View style={styles.imageContainer}>
            <IgdbImage
              imgSrc={gameCoverUrl}
              style={[styles.gameImage, { borderColor: colors.border }]}
            />
          </View>
          <View style={styles.gameInfo}>
            <View style={styles.titleRow}>
              <AppText style={styles.gameTitle}>{gameTitle}</AppText>
              <View
                style={[
                  styles.rankBadge,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.rankBadgeText,
                    { color: colors.textOnPrimary },
                  ]}
                >
                  #{position}
                </AppText>
              </View>
            </View>

            <AppText
              style={[styles.gameSubtitle, { color: colors.textSecondary }]}
            >
              Game ID {gameId} • Position {position + 1}
            </AppText>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <AppText
                  style={[styles.metaLabel, { color: colors.textSecondary }]}
                >
                  Added
                </AppText>
                <AppText style={styles.metaValue}>
                  {formatDate(createdAt)}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <AppText
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              {games.length} {games.length === 1 ? 'entry' : 'entries'} in this
              list
            </AppText>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  headerBlock: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 15,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  gameItem: {
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  gameContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
  },
  imageContainer: {
    width: 88,
    height: 120,
    marginRight: spacing.md,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  gameInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  gameTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  gameSubtitle: {
    fontSize: 14,
  },
  rankBadge: {
    minWidth: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.round,
    borderWidth: 1,
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
