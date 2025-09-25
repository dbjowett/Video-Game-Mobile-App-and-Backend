import React, { useState } from 'react';

import { AppText } from '@/components/Themed';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useGetLists } from '@/api/hooks/useGetLists';
import { ListItem } from '@/components/ListItem';
import ReorderableList, {
  ReorderableListReorderEvent,
} from 'react-native-reorderable-list';

const isExpanded = (expanded: number | null, id: string) =>
  expanded === parseInt(id);

const Page = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: lists, isLoading } = useGetLists();

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
          style={styles.listContainer}
          contentInsetAdjustmentBehavior="automatic"
          onReorder={handleReorder}
          data={lists || []}
          renderItem={({ item }) => (
            <ListItem list={item} expanded={isExpanded(expanded, item.id)} />
          )}
          keyExtractor={(list) => list.id}
        />
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
});
