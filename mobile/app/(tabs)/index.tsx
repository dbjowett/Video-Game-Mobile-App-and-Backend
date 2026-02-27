import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { usePopularGames } from '@/api';
import { ListGame, PopKey } from '@/api/types/game';
import LandingHeader from '@/components/CategoryHeader';
import GameCard from '@/components/GameCard';
import { AppText, View } from '@/components/Themed';
import { spacing } from '@/theme/constants/spacing';
import { mapListGameToCard } from '@/utils/gameCard';
import { Stack, router } from 'expo-router';
import React, { FC } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

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

export default function Page() {
  const { data: popularGames, isError, isPending } = usePopularGames();

  const SingleGame: ListRenderItem<ListGame> = ({ item }) => {
    const card = mapListGameToCard(item, {
      badge: `${Math.trunc(item.total_rating)}%`,
    });

    return (
      <Animated.View
        style={styles.itemContainer}
        entering={FadeInRight}
        exiting={FadeOutLeft}
      >
        <GameCard
          game={card}
          variant="feature"
          onPress={() => router.push(`/games/${item.id}`)}
        />
      </Animated.View>
    );
  };

  const GameList: FC<{ title: PopKey; games: ListGame[] }> = ({
    title,
    games,
  }) => (
    <View>
      <AppText style={styles.categoryTitle}>{popTypeTitleMap[title]}</AppText>
      <FlatList
        horizontal
        style={styles.listContainer}
        data={games}
        renderItem={SingleGame}
      />
    </View>
  );

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
          {popularGames
            ? Object.entries(popularGames).map(([title, games]) => (
                <GameList key={title} title={title as PopKey} games={games} />
              ))
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
});
