import { DetailedGame } from '@/api/types/game';
import { GameListWithCovers } from '@/api/types/game-list';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import React, { Dispatch, SetStateAction } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import AppButton from './AppButton';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';
import { useAddGameToList } from '@/api/hooks/useAddGameToList';

interface Props {
  list: GameListWithCovers;
  game: DetailedGame;
  selected: string | null;
  setSelected: Dispatch<SetStateAction<string | null>>;
}

const getImageStyle = (count: number, index: number): StyleProp<ViewStyle> => {
  const base = {
    padding: 2,
  };

  switch (count) {
    case 1:
      return [
        base,
        {
          width: '100%',
          aspectRatio: 1,
        },
      ];

    case 2:
      return [
        base,
        {
          width: '50%',
          aspectRatio: 1 / 2,
        },
      ];

    case 3:
      if (index === 0) {
        return [
          base,
          {
            width: '100%',
            aspectRatio: 2 / 1,
          },
        ];
      }
      return [
        base,
        {
          width: '50%',
          aspectRatio: 1,
        },
      ];

    case 4:
      return [
        base,
        {
          width: '50%',
          aspectRatio: 1,
        },
      ];

    default:
      // 4+ case — 3 images + "more" box
      return [
        base,
        {
          width: '50%',
          aspectRatio: 1,
        },
      ];
  }
};

export default function GameListPreview({
  list,
  game,
  selected,
  setSelected,
}: Props) {
  const isDisabled = list.items.some((i) => i.gameId === list.id);
  const { colors, shadows } = useTheme();
  const { width } = useWindowDimensions();
  console.log('List', list);
  const count = list._count.items;
  const addGameMutation = useAddGameToList();

  const addToList = (id: string, listId: string) => {
    // TODO: Update to use Tanstack Form
    addGameMutation.mutate({
      gameListId: listId,
      gameId: Number(id),
    });
    //    handleClose();
  };

  const cardWidth = width / 2 - spacing.md * 2;
  return (
    <TouchableOpacity
      onPress={() => setSelected(list.id)}
      style={StyleSheet.flatten([
        styles.cardWrap,
        shadows.lg,
        {
          borderRadius: radius.md,
          backgroundColor: colors.background,
          width: cardWidth,
        },
      ])}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {list.items.slice(0, count > 4 ? 3 : count).map((item, i) => (
          <View key={item.gameId} style={getImageStyle(count, i)}>
            <IgdbImage
              style={{ width: '100%', height: '100%', borderRadius: 6 }}
              imgSrc={item.gameCoverUrl}
            />
          </View>
        ))}

        {count > 4 && (
          <View
            style={[
              getImageStyle(count, 3),
              {
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: radius.md,
                backgroundColor: colors.border,
              },
            ]}
          >
            <AppText>+{count - 3}</AppText>
          </View>
        )}
      </View>

      <AppText numberOfLines={1} style={styles.titleText}>
        {list.title}
      </AppText>
      <AppText numberOfLines={1} style={styles.subtitle}>
        {count} items in this list
      </AppText>

      <AppButton
        style={{ margin: spacing.sm }}
        title="Add to List"
        size="sm"
        variant="dark"
        leftIcon="Plus"
        onPress={() => addToList(game.id, list.id)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    // height: 220,
  },

  titleText: {
    fontSize: 20,
    fontWeight: 500,
    marginLeft: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    marginLeft: spacing.sm,
    color: '#717171ff',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: spacing.sm,
  },

  image: {
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
});
