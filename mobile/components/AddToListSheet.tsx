import { useAddGameToList } from '@/api/hooks/useAddGameToList';
import { useCreateGameList } from '@/api/hooks/useCreateGameList';

import { useGetLists } from '@/api/hooks/useGetLists';
import { DetailedGame } from '@/api/types/game';
import { GameList } from '@/api/types/game-list';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/theme-context';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from './AppButton';
import CreateNewForm from './CreateNew';
import { AppText } from './Themed';

const screenWidth = Dimensions.get('window').width;

interface CreateNewFormProps {
  game: DetailedGame;
}

const AddToListSheet = forwardRef<BottomSheet, CreateNewFormProps>(
  ({ game }, ref) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
    const [data, setData] = useState({
      title: '',
      description: '',
      isPublic: false,
    });

    const { colors } = useTheme();
    const { data: gameLists, isLoading } = useGetLists();
    const createGameListMutation = useCreateGameList();
    const addGameMutation = useAddGameToList();

    const handleClose = () => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const renderItem = ({ item }: { item: GameList }) => {
      const isSelected = item.id === selected;

      return (
        <TouchableOpacity
          onPress={() => setSelected(item.id)}
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
            isSelected && {
              borderWidth: 1,
              borderColor: colors.primary,
            },
          ]}
        >
          <AppText
            style={[
              styles.cardText,
              {
                color: isSelected ? colors.primary : colors.textPrimary,
              },
            ]}
          >
            {item.title}
          </AppText>
        </TouchableOpacity>
      );
    };

    const handleCreateNewList = async () => {
      // TODO: Update to use Tanstack Form
      createGameListMutation.mutate({
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        gameIds: [game.id],
      });
      handleClose();
    };

    const addToList = () => {
      if (!selected) return;
      // TODO: Update to use Tanstack Form
      addGameMutation.mutate({
        gameListId: selected,
        gameId: Number(game.id),
      });
      handleClose();
    };

    const handleSaveClick = () =>
      isCreatingNew ? handleCreateNewList() : addToList();

    return (
      <BottomSheet
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor: colors.surface }}
        ref={ref}
        index={-1}
        snapPoints={['50%']}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <AppText style={styles.headerButton}>Cancel</AppText>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', gap: spacing.xs }}>
              <AppText style={styles.headerTitle}>Add To List</AppText>
              <AppText style={{ fontSize: 14, color: colors.textSecondary }}>
                {game.name}
              </AppText>
            </View>

            <TouchableOpacity onPress={handleSaveClick}>
              <AppText style={styles.headerButton}>Save</AppText>
            </TouchableOpacity>
          </View>

          {isCreatingNew ? (
            <View style={{ flex: 1, gap: spacing.md }}>
              <AppButton
                title="Add to Existing"
                onPress={() => setIsCreatingNew(false)}
                variant="default"
                size="md"
                fontSize="md"
                borderRadius="md"
                leftIcon="ListEnd"
              />
              <CreateNewForm data={data} setData={setData} />
            </View>
          ) : (
            <View style={{ flex: 1, gap: spacing.md }}>
              <AppButton
                title="Create New"
                onPress={() => setIsCreatingNew(true)}
                variant="default"
                size="md"
                fontSize="md"
                borderRadius="md"
                leftIcon="ListPlus"
              />
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                /* TODO: Add little "You have no lists, please create a new one" design */
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  style={{ flex: 1 }}
                  data={gameLists}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  contentContainerStyle={{ paddingBottom: spacing.md }}
                />
              )}
            </View>
          )}
        </View>
      </BottomSheet>
    );
  },
);

export default AddToListSheet;

const cardWidth = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  card: {
    width: cardWidth,
    borderWidth: StyleSheet.hairlineWidth,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontWeight: 500,
  },
});
