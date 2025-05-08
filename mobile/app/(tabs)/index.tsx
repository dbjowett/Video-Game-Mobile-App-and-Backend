import { FlatList, Image, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';

import { useExploreGames } from '@/api';
import { Game } from '@/api/types/game';
import CategoryHeader from '@/components/CategoryHeader';
import { Text, View } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
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
  const { data: games, isError, isPending } = useExploreGames();

  const onCategoryChange = () => {
    console.log(onCategoryChange);
  };

  const renderRow: ListRenderItem<Game> = ({ item }) => {
    return (
      <Link href={`/games/${item.id}`} asChild>
        <TouchableOpacity style={styles.itemContainer}>
          <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
            <Image
              source={{ uri: `https:${item.cover.url.replace('t_thumb', 't_cover_big_2x')}` }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.heartIcon}>
              <Heart size={24} color={'#fff'} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.gameName}>{item.name}</Text>
              </View>
              <View style={styles.lowerContainer}>
                <Text style={styles.rating}>{Math.trunc(item?.total_rating)}%</Text>

                <Text style={styles.rating}>{Math.trunc(item?.total_rating)}%</Text>
              </View>
            </View>
            <Text style={styles.releaseDate}>{getHumanDate(item?.first_release_date)}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  const headerHeight = useHeaderHeight();
  return (
    <View style={[styles.container, { paddingTop: headerHeight + 100 }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CategoryHeader onCategoryChange={onCategoryChange} />,
        }}
      />

      {isError && <Text>Error...</Text>}
      {isPending ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              paddingHorizontal: 16,
            }}
          >
            Popular
          </Text>
          <FlatList
            style={styles.listContainer}
            numColumns={2}
            data={games}
            renderItem={renderRow}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingTop: 10,
    width: '100%',
    paddingHorizontal: 8,
  },
  itemContainer: {
    width: '50%',
    padding: 8,
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
    justifyContent: 'space-between',
  },
  rating: {
    fontWeight: '600',
  },
  releaseDate: {
    fontSize: 12,
  },
});
