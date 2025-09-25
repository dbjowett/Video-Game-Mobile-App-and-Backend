import { GameListWithCovers } from '@/api/types/game-list';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { ThemeColors } from '@/theme/theme';
import { getImageWrapStyle } from '@/utils/getImageGrid';
import { useRouter } from 'expo-router';
import { GripVertical } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';

const DEFAULT_HEIGHT = 104;
const EXPANDED_HEIGHT = 180;

interface GameListItemProps {
  list: GameListWithCovers;
  colors: ThemeColors;
  expanded?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ListItem: React.FC<GameListItemProps> = ({
  list,
  colors,
  expanded = false,
  onPress,
  onLongPress,
}) => {
  const router = useRouter();
  const drag = useReorderableDrag();
  const count = list.items?.length || 0;

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
      style={styles.listItem}
    >
      <View style={styles.innerWrap}>
        {/* Left Container */}
        <View style={styles.leftContainer}>
          {/* Image Grid */}
          <View style={{ width: 100 }}>
            {list.items && list.items.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {list.items
                  .slice(0, list.items.length > 4 ? 3 : list.items.length)
                  .map((item, i) => (
                    <View
                      key={item.gameId}
                      style={[getImageWrapStyle(list.items.length, i)]}
                    >
                      <IgdbImage
                        imgSrc={item.gameCoverUrl}
                        style={[
                          {
                            borderWidth: StyleSheet.hairlineWidth,
                            borderRadius: radius.sm,
                            borderColor: colors.border,
                            height: '100%',
                            width: '100%',
                          },
                        ]}
                      />
                    </View>
                  ))}
                {count > 4 && (
                  <View style={[getImageWrapStyle(list.items.length, 3)]}>
                    <View
                      style={[
                        {
                          borderWidth: StyleSheet.hairlineWidth,
                          borderRadius: radius.sm,
                          borderColor: colors.border,
                          height: '100%',
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.surface,
                        },
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
          </View>

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
    borderWidth: StyleSheet.hairlineWidth,
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
    borderWidth: 1,
    borderColor: 'green',
    borderStyle: 'dashed',
  },

  imageWrap: {
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'dashed',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
