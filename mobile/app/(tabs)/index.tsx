import { ListGame, PopKey } from '@vg/types';
import { Stack, router } from 'expo-router';
import React, { FC } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { usePopularGames, useUpcomingGames } from '@/api';
import LandingHeader from '@/components/CategoryHeader';
import GameCard from '@/components/GameCard';
import { AppText, View } from '@/components/Themed';
import { spacing } from '@/theme/constants/spacing';
import { mapListGameToCard } from '@/utils/gameCard';

const popTypeTitleMap: Record<PopKey, string> = {
  visits: '🎯 Most Visited',
  wantToPlay: '📝 Want to Play',
  playing: '🎮 Currently Playing',
  played: '✅ Played',
  peakPlayers24h: '📈 Peak Players (24h)',
  positiveReviews: '👍 Positive Reviews',
  negativeReviews: '👎 Negative Reviews',
  totalReviews: '📊 Total Reviews',
};

const visibleCategoryKeys: PopKey[] = ['visits', 'playing'];

export default function Page() {
  const {
    data: popularGames,
    isError: isPopularError,
    isPending: isPopularPending,
  } = usePopularGames();
  const {
    data: upcomingGames,
    isError: isUpcomingError,
    isPending: isUpcomingPending,
  } = useUpcomingGames();

  const UpcomingGame: ListRenderItem<ListGame> = ({ item }) => {
    const card = mapListGameToCard(item);

    return (
      <Animated.View style={styles.itemContainer} entering={FadeInRight} exiting={FadeOutLeft}>
        <GameCard game={card} variant="feature" onPress={() => router.push(`/games/${item.id}`)} />
      </Animated.View>
    );
  };

  const SingleGame: ListRenderItem<ListGame> = ({ item }) => {
    const card = mapListGameToCard(item, {
      badge: `${Math.trunc(item.total_rating)}%`,
    });

    return (
      <Animated.View style={styles.itemContainer} entering={FadeInRight} exiting={FadeOutLeft}>
        <GameCard game={card} variant="feature" onPress={() => router.push(`/games/${item.id}`)} />
      </Animated.View>
    );
  };

  const GameList: FC<{ title: PopKey; games: ListGame[] }> = ({ title, games }) => (
    <View>
      <AppText style={styles.categoryTitle}>{popTypeTitleMap[title]}</AppText>
      <FlatList horizontal style={styles.listContainer} data={games} renderItem={SingleGame} />
    </View>
  );

  const isError = isPopularError || isUpcomingError;
  const isPending = isPopularPending || isUpcomingPending;
  const [heroGame, ...restUpcoming] = upcomingGames ?? [];

  return (
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: true,
          header: () => <LandingHeader />,
        }}
      />

      {isError && <AppText>Error...</AppText>}
      {isPending ? (
        <View style={{ flex: 1, marginTop: 30 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={{ paddingTop: spacing.md }}>
          {heroGame ? (
            <View>
              <AppText style={styles.categoryTitle}>🔥 Top Upcoming This Month</AppText>
              <View style={styles.heroWrapper}>
                <GameCard
                  game={mapListGameToCard(heroGame, {
                    meta: heroGame.platforms?.map((p) => p.name).join(', ') || 'Unknown Platform',
                  })}
                  variant="feature"
                  onPress={() => router.push(`/games/${heroGame.id}`)}
                  style={styles.heroCard}
                />
              </View>
              {restUpcoming.length > 0 ? (
                <FlatList
                  horizontal
                  style={styles.listContainer}
                  data={restUpcoming}
                  renderItem={UpcomingGame}
                />
              ) : null}
            </View>
          ) : null}

          {popularGames
            ? visibleCategoryKeys.map((key) =>
                popularGames[key]?.length ? (
                  <GameList key={key} title={key} games={popularGames[key]} />
                ) : null,
              )
            : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContainer: {
    marginBottom: 16,
  },
  itemContainer: {
    width: 200,
    marginHorizontal: 8,
  },
  heroWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  heroCard: {
    width: '100%',
  },
});
