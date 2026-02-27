import { useGameSearch } from '@/api/hooks/useGameSearch';
import { ListGame } from '@/api/types/game';
import GameCard from '@/components/GameCard';
import { AppText, View } from '@/components/Themed';
import { useAddToList } from '@/providers/AddToListProvider';
import { useSearchStore } from '@/store/searchStore';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { mapListGameToCard } from '@/utils/gameCard';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { ListPlus, XIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const GameItem = ({
  item,
  onPlusPress,
}: {
  item: ListGame;
  onPlusPress: (item: ListGame) => void;
}) => {
  const { colors } = useTheme();
  const card = mapListGameToCard(item);

  return (
    <GameCard
      game={card}
      variant="compact"
      onPress={() => {
        router.dismissAll();
        router.push(`/games/${item.id}`);
      }}
      style={styles.card}
      rightAccessory={
        <TouchableOpacity
          style={styles.rightContainer}
          onPress={() => onPlusPress(item)}
        >
          <ListPlus size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      }
    />
  );
};

const useDebouncedValue = <T,>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Page = () => {
  const { colors } = useTheme();
  const { openAddToListSheet } = useAddToList();
  const { input, setInput } = useSearchStore();
  const debouncedInput = useDebouncedValue(input, 300);

  const headerHeight = useHeaderHeight();

  const handlePlusPress = (item: ListGame) => {
    router.dismissAll();
    setTimeout(() => {
      openAddToListSheet(item);
    }, 100);
  };

  const {
    data: searchedGames,
    isLoading,
    isFetching,
  } = useGameSearch(debouncedInput);

  const noResults =
    !isLoading &&
    !isFetching &&
    debouncedInput === input &&
    !searchedGames?.length &&
    input.length > 0;

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.inputWrapper}>
        <TextInput
          autoFocus
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="Search.."
          onChangeText={setInput}
          value={input}
        />
        {input.length > 0 && (
          <XIcon
            size={20}
            color={colors.textPrimary}
            onPress={() => setInput('')}
          />
        )}
      </View>
      {noResults && (
        <View style={styles.loadingWrapper}>
          <AppText>No results found</AppText>
        </View>
      )}

      <FlatList
        data={searchedGames}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <GameItem item={item} onPlusPress={handlePlusPress} />
        )}
        contentContainerStyle={styles.listContent}
      />
      {(isLoading || isFetching) && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    borderBottomWidth: 1,
    marginVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  loadingWrapper: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxHeight: 50,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    fontSize: 18,
    borderColor: '#c2c2c2',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  input: {
    flex: 1,
  },
});
