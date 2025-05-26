import {
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { usePopularGames } from '@/api';
import { useGetFavouriteGames } from '@/api/hooks/useGetFavouriteGames';
import { ListGame, PopKey } from '@/api/types/game';
import LandingHeader from '@/components/CategoryHeader';
import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
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

const getHumanDate = (time?: number): string | null => {
  if (!time) return null;
  const newDate = new Date();
  newDate.setTime(time * 1000);
  return new Intl.DateTimeFormat('en-CA').format(newDate);
};

export default function Page() {
  const { data: popularGames, isError, isPending } = usePopularGames();
  const { data: favouriteGames } = useGetFavouriteGames();

  const onCategoryChange = () => {
    console.log(onCategoryChange);
  };

  const singleGame: ListRenderItem<ListGame> = ({ item }) => {
    const id = item.id.toString();
    const isFavourite = favouriteGames?.some((game) => game.gameId === id);

    return (
      <Link href={`/games/${item.id}`} asChild>
        <TouchableOpacity style={styles.itemContainer}>
          <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
            <Image
              source={{ uri: `https:${item.cover.url.replace('t_thumb', 't_cover_big_2x')}` }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.heartIcon}>
              <Heart
                size={24}
                color={'#fff'}
                fill={isFavourite ? 'red' : 'transparent'}
                stroke={isFavourite ? 'red' : '#fff'}
              />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.gameName}>{item.name}</Text>
              </View>
              <View style={styles.lowerContainer}>
                <Text style={styles.rating}>{Math.trunc(item?.total_rating)}%</Text>
              </View>
            </View>
            <Text style={styles.releaseDate}>{getHumanDate(item?.first_release_date)}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  const GameList = ({ title, games }: { title: PopKey; games: ListGame[] }) => (
    <View>
      <Text style={styles.gameListTitle}>{popTypeTitleMap[title]}</Text>
      <FlatList horizontal style={styles.listContainer} data={games} renderItem={singleGame} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: 80 }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <LandingHeader onCategoryChange={onCategoryChange} />,
        }}
      />

      {isError && <Text>Error...</Text>}
      {isPending ? (
        <Text>Loading...</Text>
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  gameListTitle: {
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
  listing: {
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
  textContainer: {
    marginTop: 4,
  },
  gameName: {
    flex: 1,
    marginRight: 8,
    fontWeight: 600,
    flexWrap: 'wrap',
  },
  lowerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
