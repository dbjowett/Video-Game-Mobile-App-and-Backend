import { useAddGameToList } from '@/api/hooks/useAddGameToList';
import { useCreateGameList } from '@/api/hooks/useCreateGameList';

import { useGetLists } from '@/api/hooks/useGetLists';
import { DetailedGame } from '@/api/types/game';
import { GameList } from '@/api/types/game-list';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/theme-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { useForm } from '@tanstack/react-form';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppButton from './AppButton';
import CreateNewForm from './CreateNew';
import { AppText } from './Themed';

const screenWidth = Dimensions.get('window').width;

interface CreateNewFormProps {
  game: DetailedGame;
}

const AddToListSheet = forwardRef<BottomSheet, CreateNewFormProps>(
  ({ game }, ref) => {
    const { width } = Dimensions.get('window');
    const { colors } = useTheme();

    const { data: gameLists, isLoading } = useGetLists();
    const createGameListMutation = useCreateGameList();
    const addGameMutation = useAddGameToList();
    const offset = useSharedValue(0);
    const formRef = useRef<{ submit: ({}: unknown) => void }>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

    const handleClose = () => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close();
      }
    };

    const form = useForm({
      defaultValues: {
        title: '',
        description: '',
        isPublic: false,
      },

      onSubmit: async ({ value }) => {
        createGameListMutation.mutate({
          title: value.title,
          description: value.description,
          isPublic: value.isPublic,
          gameIds: [game.id],
        });
        handleClose();
      },
    });

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

    useEffect(() => {
      offset.value = isCreatingNew ? 0 : 1;
    }, [isCreatingNew]);

    const createNewStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withTiming(offset.value === 0 ? 0 : -width, {
              duration: 200,
              easing: Easing.inOut(Easing.quad),
            }),
          },
        ],
        position: 'absolute',
        width: '100%',
      };
    });

    const listStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withTiming(offset.value === 1 ? 0 : width, {
              duration: 200,
              easing: Easing.inOut(Easing.quad),
            }),
          },
        ],
        position: 'absolute',
        width: '100%',
      };
    });

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
      isCreatingNew ? form.handleSubmit() : addToList();

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

          <View style={{ flex: 1, overflow: 'hidden' }}>
            <Animated.View
              style={[{ flex: 1, gap: spacing.md }, createNewStyle]}
            >
              <AppButton
                title="Add to Existing"
                onPress={() => setIsCreatingNew(false)}
                variant="default"
                size="md"
                fontSize="md"
                borderRadius="md"
                leftIcon="ListEnd"
              />
              <CreateNewForm form={form} />
            </Animated.View>

            <Animated.View style={[{ flex: 1, gap: spacing.md }, listStyle]}>
              <AppButton
                title="Create New"
                variant="default"
                size="md"
                fontSize="md"
                borderRadius="md"
                leftIcon="ListPlus"
                onPress={() => setIsCreatingNew(true)}
              />
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
            </Animated.View>
          </View>
        </View>
      </BottomSheet>
    );
  },
);

export default AddToListSheet;

const cardWidth = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: spacing.lg,
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
