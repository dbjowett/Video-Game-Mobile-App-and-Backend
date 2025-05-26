import { SimilarGame } from '@/api/types/game';
import { imageLoader } from '@/utils';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  similarGames: SimilarGame[];
};

export const SimilarGamesSection = ({ similarGames }: Props) => {
  const navigateToGameDetails = (gameId: string) => {
    router.navigate(`/games/${gameId}`);
  };
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.subtitle}>Similar Games</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.screenshotsContent}
        style={styles.screenshots}
        showsHorizontalScrollIndicator={false}
      >
        {similarGames.map((game, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              navigateToGameDetails(game.id.toString());
            }}
          >
            <Animated.Image
              source={{
                uri: imageLoader({
                  src: game.cover.url,
                  quality: 6,
                  maxSize: true,
                }),
              }}
              style={[
                styles.screenshot,
                {
                  height: 160,
                  width: 120,
                  marginRight: index === similarGames.length - 1 ? 20 : 8,
                  marginLeft: index === 0 ? 20 : 0,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginLeft: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  screenshotsContent: { flexDirection: 'row', gap: 10 },
  screenshots: {},
  screenshot: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});
