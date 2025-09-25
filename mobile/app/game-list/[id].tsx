import { useGetListsGames } from '@/api/hooks/useGetListsGames';
import { IgdbImage } from '@/components/IgdbImage';
import { AppText } from '@/components/Themed';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const Page = () => {
  const { id: gameListId } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: games, isLoading } = useGetListsGames(gameListId);

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!games) {
    router.back();
    return null;
  }

  const renderGameItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.gameItem, { borderColor: colors.borderStrong }]}
      onPress={() => {
        router.push(`/games/${item.gameId}`);
      }}
    >
      <View style={styles.gameContent}>
        <View style={styles.imageContainer}>
          <IgdbImage
            imgSrc={item.gameCoverUrl}
            style={[styles.gameImage, { borderColor: colors.border }]}
          />
        </View>
        <View style={styles.gameInfo}>
          <AppText style={styles.gameTitle}>Game ID: {item.gameId}</AppText>
          <AppText
            style={[styles.gameSubtitle, { color: colors.textSecondary }]}
          >
            Position: {item.position}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  gameItem: {
    borderWidth: 1,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: 'transparent',
  },
  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  imageContainer: {
    width: 80,
    height: 100,
    marginRight: spacing.md,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  gameSubtitle: {
    fontSize: 14,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
