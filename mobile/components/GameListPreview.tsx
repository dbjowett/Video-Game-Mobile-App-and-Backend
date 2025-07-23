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
} from 'react-native';
import AppButton from './AppButton';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';

interface Props {
  list: GameListWithCovers;
  game: DetailedGame;
  selected: string | null;
  setSelected: Dispatch<SetStateAction<string | null>>;
}

export default function GameListPreview({
  list,
  game,
  selected,
  setSelected,
}: Props) {
  const isSelected = game.id === selected;
  const isDisabled = list.items.some((i) => i.gameId === list.id);
  const { colors, shadows } = useTheme();
  const { width } = useWindowDimensions();

  const cardWidth = width / 2 - spacing.md * 2;
  const imageSize = cardWidth / 2 - (spacing.md - spacing.sm / 2);
  const imageWrapSize = cardWidth / 2;

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
      {/* Grid 1 item = 1 large || 4 items and fill || if more than 4 add `+{count - 4}` */}
      <View style={styles.imageGrid}>
        {list.items.slice(0, 3).map(({ gameId, gameCoverUrl }) => (
          <IgdbImage
            style={StyleSheet.flatten([
              styles.image,
              { borderRadius: radius.sm },
            ])}
            height={imageSize}
            width={imageSize}
            imgSrc={gameCoverUrl}
            quality={2}
          />
        ))}
        {list.items.length >= 3 && (
          <View
            style={StyleSheet.flatten([
              styles.image,
              {
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                background: colors.border,
                width: imageSize,
                height: imageSize,
              },
            ])}
          >
            <AppText>+1</AppText>
          </View>
        )}
      </View>

      <AppText numberOfLines={1} style={styles.titleText}>
        {list.title}
      </AppText>
      <AppText numberOfLines={1} style={styles.subtitle}>
        {list.items.length} items in this list
      </AppText>

      <AppButton
        style={{ margin: spacing.sm }}
        title="Add to List"
        size="sm"
        variant="dark"
        leftIcon="Plus"
        onPress={() => ''}
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
