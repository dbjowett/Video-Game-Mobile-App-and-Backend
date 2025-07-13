import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';

import { useGetFavouriteGames } from '@/api/hooks/useGetFavouriteGames';
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

const Page = () => {
  const { data: games, isLoading } = useGetFavouriteGames();
  const headerHeight = useHeaderHeight();
  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <Text style={styles.title}>Wishlist</Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        games?.map((game) => <Text key={game.gameId}>{game.gameId}</Text>)
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
