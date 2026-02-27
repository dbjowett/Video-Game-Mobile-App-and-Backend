import { SimilarGame } from '@/api/types/game';
import GameCard from '@/components/GameCard';
import { useTheme } from '@/theme/theme-context';
import { mapSimilarGameToCard } from '@/utils/gameCard';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from './Themed';

type Props = {
  similarGames: SimilarGame[];
};

export const SimilarGamesSection = ({ similarGames }: Props) => {
  const { colors } = useTheme();

  const navigateToGameDetails = (gameId: string) => {
    router.navigate(`/games/${gameId}`);
  };
  return (
    <View style={{ marginTop: 20 }}>
      <AppText style={styles.subtitle}>Similar Games</AppText>
      <ScrollView
        horizontal
        contentContainerStyle={styles.screenshotsContent}
        style={styles.screenshots}
        showsHorizontalScrollIndicator={false}
      >
        {similarGames.map((game, index) => (
          <GameCard
            key={game.id}
            game={mapSimilarGameToCard(game)}
            variant="feature"
            style={[
              styles.card,
              {
                marginRight: index === similarGames.length - 1 ? 20 : 8,
                marginLeft: index === 0 ? 20 : 0,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            imageStyle={styles.cardImage}
            onPress={() => {
              navigateToGameDetails(game.id.toString());
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  screenshotsContent: { flexDirection: 'row', gap: 10 },
  screenshots: {},
  card: {
    width: 132,
  },
  cardImage: {
    height: 176,
  },
});
