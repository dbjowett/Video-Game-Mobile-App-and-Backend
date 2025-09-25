import { GameListWithCovers } from '@/api/types/game-list';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { getImageWrapStyle } from '@/utils/getImageGrid';
import { useRouter } from 'expo-router';
import { GripVertical } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';

interface GameListItemProps {
  list: GameListWithCovers;
  expanded?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ListItem: React.FC<GameListItemProps> = ({
  list,
  onPress,
  onLongPress,
}) => {
  const router = useRouter();
  const drag = useReorderableDrag();
  const count = list.items?.length || 0;
  const { colors } = useTheme();

  return (
    <Pressable
      onLongPress={() => {
        drag();
        onLongPress?.();
      }}
      onPress={() => {
        router.push(`/game-list/${list.id}`);
        onPress?.();
      }}
      style={[styles.listItem, { borderColor: colors.borderStrong }]}
    >
      <View style={styles.innerWrap}>
        <View style={styles.leftContainer}>
          {count > 0 && (
            <View style={styles.imageWrap}>
              {list.items
                .slice(0, list.items.length > 4 ? 3 : list.items.length)
                .map((item, i) => (
                  <View
                    key={item.gameId}
                    style={[getImageWrapStyle(list.items.length, i)]}
                  >
                    <IgdbImage
                      imgSrc={item.gameCoverUrl}
                      style={[styles.image, { borderColor: colors.border }]}
                    />
                  </View>
                ))}
              {count > 4 && (
                <View style={[getImageWrapStyle(list.items.length, 3)]}>
                  <View
                    style={[
                      styles.imagePlaceholder,
                      styles.image,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <AppText style={{ fontSize: 12, fontWeight: '500' }}>
                      +{count - 3}
                    </AppText>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Title and Description */}
          <View>
            <AppText style={{ fontSize: 18, fontWeight: '500' }}>
              {list.title}
            </AppText>
            <AppText
              style={{ fontSize: 14, color: colors.textSecondary }}
            >{`${count} games`}</AppText>
          </View>
        </View>

        {/* Right Container */}
        <View style={styles.rightContainer}>
          <GripVertical color={colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginVertical: spacing.sm,
    borderWidth: 1,

    borderRadius: radius.md,
    padding: spacing.xs,
  },
  innerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageWrap: {
    width: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  image: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    height: '100%',
    width: '100%',
  },

  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
