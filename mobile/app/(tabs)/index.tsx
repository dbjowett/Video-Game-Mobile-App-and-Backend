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
import { ListGame } from '@/api/types/game';
import LandingHeader from '@/components/CategoryHeader';
import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

// const IGDB_URL = 'https://images.igdb.com/igdb/image/upload/t_thumb/co27j9.jpg';

const getHumanDate = (time?: number): string | null => {
  if (!time) return null;
  const newDate = new Date();
  newDate.setTime(time * 1000);
  return new Intl.DateTimeFormat('en-CA').format(newDate);
};
// getHumanDate(item?.first_release_date);

export default function Page() {
  const { data: popularGames, isError, isPending } = usePopularGames();
  const { data: favouriteGames, isLoading: isLoadingGames } = useGetFavouriteGames();

  const onCategoryChange = () => {
    console.log(onCategoryChange);
  };

  const renderRow: ListRenderItem<ListGame> = ({ item }) => {
    const isFavourite = favouriteGames?.some((game) => game.gameId === item.id.toString());
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

  const GameList = ({ title, games }: { title: string; games: ListGame[] }) => {
    return (
      <View>
        <Text style={styles.gameListTitle}>{title}</Text>
        <FlatList horizontal style={styles.listContainer} data={games} renderItem={renderRow} />
      </View>
    );
  };

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
            ? Object.entries(popularGames).map(([k, v]) => {
                return <GameList title={k} games={v} />;
              })
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
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContainer: {
    // borderColor: 'black',
    // borderWidth: 1,
    // borderRadius: 8,
    // height: 100,
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
