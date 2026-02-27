import { useGetListsGames } from '@/api/hooks/useGetListsGames';
import { GameListItem } from '@/api/types/game-list';
import GameCard from '@/components/GameCard';
import { AppText } from '@/components/Themed';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { mapGameListItemToCard } from '@/utils/gameCard';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
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
  const { colors } = useTheme();
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
    const card = mapGameListItemToCard(gameItem, {
      meta: `Added ${formatDate(gameItem.createdAt)}`,
    });

    return (
      <GameCard
        game={card}
        variant="default"
        style={styles.gameItem}
        onPress={() => {
          router.push(`/games/${gameItem.gameId}`);
        }}
      />
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
    marginBottom: spacing.md,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
