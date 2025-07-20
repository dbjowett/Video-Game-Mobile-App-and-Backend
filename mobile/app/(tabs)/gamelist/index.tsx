import React from 'react';

import { AppText } from '@/components/Themed';

import { useTheme } from '@/theme/theme-context';
import { useRouter } from 'expo-router';
import { GripVertical } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useGetLists } from '@/api/hooks/useGetLists';
import { GameList } from '@/api/types/game-list';
import { ThemeColors } from '@/theme/theme';
import ReorderableList, {
  ReorderableListReorderEvent,
  useReorderableDrag,
} from 'react-native-reorderable-list';

const DEFAULT_HEIGHT = 70;
const EXPANDED_HEIGHT = 140;

const GameListItem = ({
  list,
  colors,
}: {
  list: GameList;
  colors: ThemeColors;
}) => {
  const router = useRouter();
  const drag = useReorderableDrag();
  return (
    <Pressable
      onLongPress={drag}
      onPress={() => router.push(`/game-list/${list.id}`)}
    >
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Left Content */}
        <View style={styles.leftContainer}>
          {/* <Image
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
          /> */}
          <AppText style={styles.itemText}>{list.title}</AppText>
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
  const { data: lists, isLoading } = useGetLists();
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: GameList }) => (
    <GameListItem list={item} colors={colors} />
  );

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    console.log('From:', from, 'To:', to);
  };

  return (
    <View style={styles.pageContainer}>
      {!isLoading && !lists?.length && <AppText>No Games Found</AppText>}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ReorderableList
          onReorder={handleReorder}
          data={lists || []}
          renderItem={renderItem}
          keyExtractor={(list) => list.id.toString()}
        >
          <>
            {lists?.map((list) => (
              <GameListItem key={list.id} list={list} colors={colors} />
            ))}
            {lists?.map((list) => (
              <GameListItem key={list.id} list={list} colors={colors} />
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
    marginTop: 160,
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
    height: 50,
    width: 50,
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
