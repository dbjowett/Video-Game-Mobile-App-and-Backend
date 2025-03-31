import { FlatList, Image, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';

import { useExploreGames } from '@/api';
import { Game } from '@/api/types/game';
import CategoryHeader from '@/components/CategoryHeader';
import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const IGDB_URL = 'https://images.igdb.com/igdb/image/upload/t_thumb/co27j9.jpg';

const getHumanDate = (time?: number): string | null => {
  if (!time) return null;
  const newDate = new Date();
  newDate.setTime(time * 1000);
  return new Intl.DateTimeFormat('en-CA').format(newDate);
};
// getHumanDate(item?.first_release_date);

export default function TabOneScreen() {
  const { data: games, isError, isPending } = useExploreGames();
  console.log(games, isError);

  if (isPending) return <Text>Loading...</Text>;
  if (isError) return <Text>Error...</Text>;

  const onCategoryChange = () => {
    console.log(onCategoryChange);
  };

  const renderRow: ListRenderItem<Game> = ({ item }) => {
    return (
      <Link href={`/games/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
            <Image source={{ uri: `https:${item.cover.url}` }} style={styles.image} />
            <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
              <Heart size={24} color={'#fff'} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontWeight: 600 }}>{item.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  alignSelf: 'baseline',
                }}
              >
                <Text style={{ fontWeight: 600 }}>{Math.trunc(item?.total_rating)}%</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12 }}>{getHumanDate(item?.first_release_date)}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <CategoryHeader onCategoryChange={onCategoryChange} />,
        }}
      />
      <FlatList data={games} renderItem={renderRow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    borderColor: '#fff',
    borderWidth: 1,
    marginTop: 130,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  listing: {
    flex: 1,
    padding: 16,
    width: '100%',
    gap: 4,
    marginVertical: 8,
  },
  image: {
    height: 300,
    borderRadius: 8,
  },
});
