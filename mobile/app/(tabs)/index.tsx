import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { usePopularGames } from '@/api';
import { ListGame, PopKey } from '@/api/types/game';
import LandingHeader from '@/components/CategoryHeader';
import { AppText, View } from '@/components/Themed';
import { useTheme } from '@/theme/theme-context';
import { getHumanDate } from '@/utils';
import { Link, Stack } from 'expo-router';
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

  const { colors } = useTheme();
  const SingleGame: ListRenderItem<ListGame> = ({ item }) => {
    return (
      <Link href={`/games/${item.id}`} asChild>
        <TouchableOpacity style={styles.itemContainer}>
          <Animated.View
            style={styles.innerWrap}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            {/* Image */}
            <Image
              source={{
                uri: `https:${item.cover.url.replace('t_thumb', 't_cover_big_2x')}`,
              }}
              style={styles.image}
            />

            {/* Content */}
            <View style={styles.lowerContainer}>
              <View>
                <AppText numberOfLines={1} style={styles.gameName}>
                  {item.name}
                </AppText>
              </View>
              <View style={styles.infoContainer}>
                <AppText
                  style={StyleSheet.flatten([
                    styles.rating,
                    { backgroundColor: colors.surface },
                  ])}
                >
                  {Math.trunc(item?.total_rating)}%
                </AppText>
                <AppText style={styles.releaseDate}>
                  {getHumanDate(item?.first_release_date)}
                </AppText>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
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
          header: () => <LandingHeader />,
        }}
      />

      {isError && <AppText>Error...</AppText>}
      {isPending ? (
        <View style={{ flex: 1, marginTop: 30 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView>
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
    borderRadius: 8,
    padding: 2,

    width: 200,
    marginHorizontal: 8,
  },
  innerWrap: {
    flex: 1,
    gap: 1,
    marginVertical: 0,
    position: 'relative',
  },

  image: {
    height: 300,
    borderRadius: 8,
  },
  heartIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },

  lowerContainer: {
    paddingHorizontal: 2,
    marginTop: 2,
  },
  gameName: {
    flex: 1,
    marginRight: 8,
    fontWeight: 600,
    flexWrap: 'wrap',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    fontWeight: '600',
  },
  releaseDate: {
    fontSize: 12,
  },
});
