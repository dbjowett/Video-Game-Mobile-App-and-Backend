import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';

import { useGetFavGameDetails } from '@/api/hooks/useGetFavGameDetails';
import { ListGame } from '@/api/types/game';
import { Text, View } from '@/components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';

const WishlistItem = ({ game }: { game: ListGame }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{game.name}</Text>
  </View>
);

const Page = () => {
  const { data: games, isLoading } = useGetFavGameDetails();
  const headerHeight = useHeaderHeight();
  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        games?.map((game) => <WishlistItem key={game.id} game={game} />)
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

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '90%',
    backgroundColor: '#f1f1f1a6',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
