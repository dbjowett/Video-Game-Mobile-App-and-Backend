import { GameListWithCovers } from '@/api/types/game-list';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { getImageWrapStyle } from '@/utils/getImageGrid';
import { useRouter } from 'expo-router';
import { GripVertical } from 'lucide-react-native';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';
import { IgdbImage } from './IgdbImage';
import { AppText } from './Themed';

interface GameListItemProps {
  list: GameListWithCovers;
  expanded?: boolean;
}

export const ListItem: FC<GameListItemProps> = ({ list }) => {
  const router = useRouter();
  const drag = useReorderableDrag();
  const count = list.items?.length || 0;
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onLongPress={drag}
        onPress={() => router.push(`/list/${list.id}`)}
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
            <View style={styles.textContainer}>
              <AppText numberOfLines={2} style={styles.textTitle}>
                {list.title}
              </AppText>
              <AppText
                numberOfLines={3}
                style={[
                  styles.textDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {list.description}
              </AppText>
            </View>
          </View>

          {/* Right Container */}
          <View style={styles.rightContainer}>
            <GripVertical color={colors.textSecondary} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  listItem: {
    width: '90%',
    alignSelf: 'center',
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
    gap: 12,
    flex: 1,
  },
  textContainer: {
    marginTop: spacing.xs,
    flex: 1,
    gap: spacing.sm,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  textDescription: {
    fontSize: 14,
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
