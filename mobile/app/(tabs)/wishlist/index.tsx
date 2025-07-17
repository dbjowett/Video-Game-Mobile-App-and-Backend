import React from 'react';

import { useGetFavGameDetails } from '@/api/hooks/useGetFavGameDetails';
import { ListGame } from '@/api/types/game';
import { Text } from '@/components/Themed';
import { CustomThemeColors } from '@/theme/theme';
import { useTheme } from '@/theme/theme-context';
import { imageLoader } from '@/utils';
import { useRouter } from 'expo-router';
import { GripVertical } from 'lucide-react-native';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import ReorderableList, {
  ReorderableListReorderEvent,
  useReorderableDrag,
} from 'react-native-reorderable-list';

const DEFAULT_HEIGHT = 70;
const EXPANDED_HEIGHT = 140;

const WishlistItem = ({
  game,
  colors,
}: {
  game: ListGame;
  colors: CustomThemeColors;
}) => {
  const router = useRouter();
  const drag = useReorderableDrag();
  return (
    <Pressable
      onLongPress={drag}
      onPress={() => router.push(`/games/${game.id}`)}
    >
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderDark,
          },
        ]}
      >
        {/* Left Content */}
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri: imageLoader({
                src: game.cover?.url,
                quality: 2,
              }),
            }}
            style={{
              minHeight: 50,
              minWidth: 50,
              borderRadius: 6,
            }}
          />
          <Text style={styles.itemText} numberOfLines={1}>
            {game.name}
          </Text>
        </View>

        {/* Right Content */}
        <View style={styles.rightContainer}>
          {/* Maybe add an options menu here? */}
          <GripVertical color={colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
};
const Page = () => {
  const { data: games, isLoading } = useGetFavGameDetails();
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: ListGame }) => (
    <WishlistItem game={item} colors={colors} />
  );

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    console.log('From:', from, 'To:', to);
  };

  return (
    <View style={styles.pageContainer}>
      {!isLoading && !games?.length && <Text>No Games Found</Text>}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ReorderableList
          onReorder={handleReorder}
          data={games || []}
          renderItem={renderItem}
          keyExtractor={(game) => game.id.toString()}
        >
          <>
            {games?.map((game) => (
              <WishlistItem key={game.id} game={game} colors={colors} />
            ))}
            {games?.map((game) => (
              <WishlistItem key={game.id} game={game} colors={colors} />
            ))}
          </>
        </ReorderableList>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  box: {
    height: 40,
    width: 40,
    backgroundColor: 'pink',
  },
  pageContainer: {
    flex: 1,
  },

  itemContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  itemText: {
    maxWidth: '75%',
    fontSize: 16,
    fontWeight: 500,
  },
});
