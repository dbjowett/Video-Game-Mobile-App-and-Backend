import { useAddFavouriteGame } from '@/api/hooks/useAddFavouriteGame';
import { useGameDetails } from '@/api/hooks/useGameDetails';
import { useGetFavouriteGames } from '@/api/hooks/useGetFavouriteGames';
import { useRemoveFavouriteGame } from '@/api/hooks/useRemoveFavouriteGame';
import { MoreText } from '@/components/MoreText';
import { defaultStyles } from '@/constants/Styles';
import { useColours } from '@/hooks/useColours';
import { imageLoader } from '@/utils';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronLeft, Heart, Share as ShareIcon } from 'lucide-react-native';
import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [imageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const { data: favouriteGames, isLoading: isLoadingGames } = useGetFavouriteGames();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { mutateAsync: addGameAsync } = useAddFavouriteGame(id);
  const { mutateAsync: removeGameAsync } = useRemoveFavouriteGame(id);
  const colours = useColours();

  const { data: game, isLoading } = useGameDetails(id);
  const isFaved = favouriteGames?.some((game) => game.gameId.toString() === id);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef.current ? scrollRef : null);
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
    } else {
      await removeGameAsync(id);
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.2], [0, 1]),
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!imageLoaded) return {};
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
              [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
            ),
          },
          {
            scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
          },
        ],
      };
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]} numberOfLines={1}>
          {game?.name}
        </Animated.Text>
      ),
      headerTransparent: true,
      headerBackground: () => <Animated.View style={[styles.header, headerAnimatedStyle]} />,
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <ShareIcon size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={handleFavourite}>
            <Heart
              size={22}
              fill={isFaved ? 'red' : 'transparent'}
              stroke={isFaved ? 'red' : colours.primary}
            />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <ChevronLeft size={22} />
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
  console.log(game);

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
              src: game?.cover?.url,
              quality: 6,
              maxSize: true,
            }),
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{game.name} </Text>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
          <View style={styles.summary}>
            <MoreText text={game.summary} />
          </View>
        </View>
      </Animated.ScrollView>
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            {/* <Text style={styles.footerPrice}>Rating: {game.total_rating.toFixed(0)}</Text>
            <Text>%</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFavourite}
            style={[
              defaultStyles.btn,
              {
                paddingRight: 20,
                paddingLeft: 20,
                flexDirection: 'row',
                gap: 10,
                backgroundColor: colours.primary,
              },
            ]}
          >
            <Heart
              size={22}
              color="white"
              fill={isFaved ? 'red' : 'transparent'}
              stroke={isFaved ? 'red' : 'white'}
            />

            <Text style={defaultStyles.btnText}>
              {!isFaved ? 'Add to wishlist' : 'Remove from wishlist'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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

  contentWrap: {
    backgroundColor: 'white',
    paddingBottom: 200,
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    opacity: 0.7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
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
