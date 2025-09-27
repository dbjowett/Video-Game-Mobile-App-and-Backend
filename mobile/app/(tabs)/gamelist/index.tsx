import React from 'react';

import { AppText } from '@/components/Themed';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useGetLists } from '@/api/hooks/useGetLists';
import { useUpdateListOrder } from '@/api/hooks/useUpdateListOrder';
import { ListItem } from '@/components/ListItem';
import ReorderableList, {
  ReorderableListReorderEvent,
} from 'react-native-reorderable-list';

const Page = () => {
  const { data: lists, isLoading } = useGetLists();
  const updateListOrderMutation = useUpdateListOrder();

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const id = lists?.[from]?.id;
    if (!id) return;
    updateListOrderMutation.mutate({ from, to, id });
  };

  return (
    <View style={styles.pageContainer}>
      {!isLoading && lists?.length === 0 && (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyListText}> No Game Lists Found</AppText>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ReorderableList
          style={styles.listContainer}
          contentInsetAdjustmentBehavior="automatic"
          onReorder={handleReorder}
          data={lists || []}
          renderItem={({ item }) => <ListItem list={item} />}
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
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
