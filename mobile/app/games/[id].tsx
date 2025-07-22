import { useAddFavouriteGame } from '@/api/hooks/useAddFavouriteGame';
import { useGameDetails } from '@/api/hooks/useGameDetails';
import { useGetFavouriteGames } from '@/api/hooks/useGetFavGames';
import { useRemoveFavouriteGame } from '@/api/hooks/useRemoveFavouriteGame';
import AddToListSheet from '@/components/AddToListSheet';
import AppButton from '@/components/AppButton';
import { MoreText } from '@/components/MoreText';
import { ScreenshotsSection } from '@/components/ScreenshotsSection';
import { SimilarGamesSection } from '@/components/SImilarGamesSection';
import { AppText } from '@/components/Themed';
import { VideosSection } from '@/components/VideosSection';
import { defaultStyles } from '@/constants/Styles';
import { useTheme } from '@/theme/theme-context';
import { imageLoader } from '@/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronLeft, Share as ShareIcon } from 'lucide-react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Share,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const IMG_HEIGHT = 500;
const { width } = Dimensions.get('window');

const Page = () => {
  const addToListRef = useRef<BottomSheet | null>(null);
  const [imageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isImageViewerVisible, setIsImageViewerVisible] =
    useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  // ** Fetch favourite games and game details
  const { data: favouriteGames } = useGetFavouriteGames();
  const { data: game, isLoading } = useGameDetails(id);

  // ** Mutations for adding/removing favourite games
  const { mutateAsync: addGameAsync } = useAddFavouriteGame();
  const { mutateAsync: removeGameAsync } = useRemoveFavouriteGame();

  const isFaved = favouriteGames?.some((game) => game.gameId.toString() === id);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(
    scrollRef.current ? scrollRef : null,
  );
  const navigation = useNavigation();

  const shareListing = async () => {
    try {
      await Share.share({
        title: game?.name || '',
        url: game?.cover?.url || '',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavourite = async () => {
    if (!isFaved) {
      await addGameAsync(id);
      Vibration.vibrate(50);
    } else {
      await removeGameAsync(id);
      Vibration.vibrate(50);
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.2], [0, 1]),
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const duration = 100;
    const isVisible = scrollOffset.value > IMG_HEIGHT / 1.1;
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration }),
      transform: [
        {
          translateX: withTiming(isVisible ? 0 : -20, { duration }),
        },
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    if (!imageLoaded) return {};
    {
      return {
        transform: [
          {
            translateY: interpolate(
              scrollOffset.value,
              [-IMG_HEIGHT, 0, IMG_HEIGHT],
              [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
            ),
          },
          {
            scale: interpolate(
              scrollOffset.value,
              [-IMG_HEIGHT, 0, IMG_HEIGHT],
              [2, 1, 1],
            ),
          },
        ],
      };
    }
  });

  const openBottomSheet = () => addToListRef.current?.snapToIndex(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.Text
          style={[
            styles.headerTitle,
            titleAnimatedStyle,
            { color: colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {game?.name}
        </Animated.Text>
      ),
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View
          style={[
            styles.header,
            headerAnimatedStyle,
            { backgroundColor: colors.background },
          ]}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          style={[styles.roundButton, { backgroundColor: colors.background }]}
          onPress={shareListing}
        >
          <ShareIcon size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={[styles.roundButton, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [isFaved, game]);

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!game) {
    router.back();
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={styles.contentWrap}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          onLoad={() => setIsImageLoaded(true)}
          source={{
            uri: imageLoader({
              imgSrc: game?.cover?.url,
              quality: 6,
              maxSize: true,
            }),
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <AppText style={styles.title}>{game.name}</AppText>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <ScreenshotsSection
            screenshots={game.screenshots}
            onImagePress={(index) => {
              setActiveImageIndex(index);
              setIsImageViewerVisible(true);
            }}
          />
          <VideosSection videos={game.videos} />
        </View>

        {/* Similar games game.similar_games */}
        <SimilarGamesSection similarGames={game.similar_games} />
      </Animated.ScrollView>
      <Animated.View
        style={[defaultStyles.footer]}
        entering={SlideInDown.delay(700).damping(20)}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppButton
            title="Add"
            size="md"
            fontSize="md"
            borderRadius="md"
            leftIcon="Plus"
            onPress={openBottomSheet}
          />
        </View>
      </Animated.View>
      <ImageViewing
        swipeToCloseEnabled
        images={game.screenshots.map((s) => ({
          uri: imageLoader({ imgSrc: s.url, quality: 10, maxSize: true }),
        }))}
        imageIndex={activeImageIndex}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
      />

      <AddToListSheet ref={addToListRef} game={game} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToListBtn: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  contentWrap: {
    paddingBottom: 120,
    flexGrow: 1,
  },

  contentContainer: {
    zIndex: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  title: {
    padding: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },

  summary: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },

  image: {
    width: width,
    height: IMG_HEIGHT,
    zIndex: 1,
  },

  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    opacity: 0.7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },

  headerTitle: {
    fontSize: 18,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
  },
  footerText: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
  },
});
