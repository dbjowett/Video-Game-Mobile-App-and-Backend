import React, { useState } from 'react';

import { AppText } from '@/components/Themed';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useGetLists } from '@/api/hooks/useGetLists';
import { GameListWithCovers } from '@/api/types/game-list';
import { ListItem } from '@/components/ListItem';
import ReorderableList, {
  ReorderableListReorderEvent,
} from 'react-native-reorderable-list';

const isExpanded = (expanded: number | null, id: string) =>
  expanded === parseInt(id);

const Page = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: lists, isLoading } = useGetLists();

  const renderItem = ({ item }: { item: GameListWithCovers }) => (
    <ListItem list={item} expanded={isExpanded(expanded, item.id)} />
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
        <View style={styles.listContainer}>
          <ReorderableList
            onReorder={handleReorder}
            data={lists || []}
            renderItem={renderItem}
            keyExtractor={(list) => list.id.toString()}
          >
            <View style={styles.listContainer}>
              {lists?.map((list) => (
                <ListItem
                  key={list.id}
                  list={list}
                  expanded={isExpanded(expanded, list.id)}
                />
              ))}
            </View>
          </ReorderableList>
        </View>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    marginTop: 152, // TODO: Fix this to account for the header
  },
  listContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
});
