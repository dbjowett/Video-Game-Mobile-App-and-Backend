import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';

import { useGetFavGameDetails } from '@/api/hooks/useGetFavGameDetails';
import { ListGame } from '@/api/types/game';
import { Text } from '@/components/Themed';
import { CustomThemeColors } from '@/theme/theme';
import { useTheme } from '@/theme/theme-context';
import { imageLoader } from '@/utils';
import { GripVertical } from 'lucide-react-native';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const DEFAULT_HEIGHT = 70;
const EXPANDED_HEIGHT = 140;

const WishlistItem = ({
  game,
  colors,
  expandedId,
  setExpandedId,
}: {
  game: ListGame;
  colors: CustomThemeColors;
  expandedId: number | null;
  setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const height = useSharedValue(DEFAULT_HEIGHT);

  useEffect(() => {
    const newHeight = expandedId === game.id ? EXPANDED_HEIGHT : DEFAULT_HEIGHT;
    height.value = withSpring(newHeight);
  }, [expandedId]);

  const animatedContainerStyles = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        setExpandedId(expandedId === game.id ? null : game.id);
      }}
    >
      <Animated.View
        style={[
          styles.itemContainer,
          animatedContainerStyles,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderDark,
          },
        ]}
      >
        {/* Left Content */}
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri: imageLoader({
                src: game.cover?.url,
                quality: 2,
              }),
            }}
            style={{
              minHeight: 50,
              minWidth: 50,
              borderRadius: 6,
            }}
          />
          <Text style={styles.itemText}>{game.name}</Text>
        </View>

        {/* Right Content */}
        <View style={styles.rightContainer}>
          {/* Maybe add an options menu here? */}
          <GripVertical color={colors.textSecondary} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
const Page = () => {
  const { data: games, isLoading } = useGetFavGameDetails();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();
  return (
    <View style={[styles.pageContainer, { paddingTop: headerHeight }]}>
      {/* <Animated.View style={[styles.box, animatedStyles]} /> */}
      {/* <Button onPress={handlePressNew} title="Press" /> */}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        games?.map((game) => (
          <WishlistItem
            key={game.id}
            game={game}
            colors={colors}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        ))
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  box: {
    height: 40,
    width: 40,
    backgroundColor: 'pink',
  },
  pageContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  itemContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 500,
  },
});
