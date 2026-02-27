import { useAddGameToList } from '@/api/hooks/useAddGameToList';
import { AddableGame } from '@/api/types/game';
import { GameListWithCovers } from '@/api/types/game-list';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { getImageWrapStyle } from '@/utils/getImageGrid';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import AppButton from './AppButton';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';

interface Props {
  list: GameListWithCovers;
  game: AddableGame;
  handleClose: () => void;
}

export default function GameListPreview({ list, game, handleClose }: Props) {
  const gameId = Number(game.id);
  const isDisabled = list.items.some((i) => Number(i.gameId) === gameId);

  const { colors, shadows } = useTheme();
  const { width } = useWindowDimensions();
  const count = list.items.length;
  const addGameMutation = useAddGameToList();

  const addToList = (id: number, listId: string) => {
    // TODO: Update to use Tanstack Form
    addGameMutation.mutate({
      gameListId: listId,
      gameId: id,
    });

    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  const cardWidth = width / 2 - spacing.md * 2;
  return (
    <View
      style={StyleSheet.flatten([
        styles.cardWrap,
        shadows.lg,
        {
          borderRadius: radius.md,
          backgroundColor: colors.surface,
          width: cardWidth,
        },
      ])}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {list.items.slice(0, count > 4 ? 3 : count).map((item, i) => (
          <View key={item.gameId} style={getImageWrapStyle(count, i)}>
            <IgdbImage
              style={[styles.image, { borderColor: colors.border }]}
              imgSrc={item.gameCoverUrl}
            />
          </View>
        ))}

        {count > 4 && (
          <View style={[getImageWrapStyle(count, 3)]}>
            <View style={[styles.image, { borderColor: colors.border }]}>
              <AppText>+{count - 3}</AppText>
            </View>
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
        disabled={isDisabled}
        onPress={() => addToList(gameId, list.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    // height: 220,
    position: 'relative',
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
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    //  padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
