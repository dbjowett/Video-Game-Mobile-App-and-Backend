import { useGameDetails } from '@/api/hooks/useGameDetails';
import { defaultStyles } from '@/constants/Styles';
import { imageLoader } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Dimensions, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const IMG_HEIGHT = 500;
const { width } = Dimensions.get('window');

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: game, isLoading } = useGameDetails(id);

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

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.4], [0, 1]),
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
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
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => <Animated.View style={[styles.header, headerAnimatedStyle]} />,
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons size={22} name="share-outline" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons size={22} name="heart-outline" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons size={22} name="chevron-back" />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!game) {
    router.back();
    return null;
  }

  const uri = imageLoader({
    src: game?.cover?.url,
    quality: 6,
    maxSize: true,
  });

  return (
    <View>
      <Animated.ScrollView
        contentContainerStyle={styles.contentWrap}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image source={{ uri }} style={[styles.image, imageAnimatedStyle]} />
        <Text style={styles.title}>{game.name} </Text>
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
            <Text style={styles.footerPrice}>Rating: {game.total_rating.toFixed(0)}</Text>
            <Text>%</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Add to wishlist</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  contentWrap: {
    backgroundColor: '#fff',
    paddingBottom: 200,
  },
  title: {
    padding: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },

  image: {
    width: width,
    height: IMG_HEIGHT,
    // borderRadius: 10,
  },

  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
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
