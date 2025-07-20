import { useGetListsGames } from '@/api/hooks/useGetListsGames';
import { AppText } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

const Page = () => {
  const { id: gameListId } = useLocalSearchParams<{ id: string }>();
  // const { colors } = useTheme();

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

  return (
    <View style={{ flex: 1 }}>
      <AppText>Games</AppText>
      <View>
        <FlatList
          data={games}
          renderItem={({ item }) => (
            <View>
              <AppText>{item.gameId}</AppText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
