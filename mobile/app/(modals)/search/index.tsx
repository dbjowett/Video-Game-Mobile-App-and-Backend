import { useGameSearch } from '@/api/hooks/useGameSearch';
import { ListGame } from '@/api/types/game';
import { AppText, View } from '@/components/Themed';
import { useAddToList } from '@/providers/AddToListProvider';
import { useSearchStore } from '@/store/searchStore';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { getHumanDate, imageLoader } from '@/utils';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { CalendarCheck, ListPlus, XIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  return (
    <TouchableOpacity
      onPress={() => {
        router.dismissAll();
        router.push(`/games/${item.id}`);
      }}
    >
      <View style={styles.innerWrap}>
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri: imageLoader({
                imgSrc: item.cover?.url,
                quality: 1,
              }),
            }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View style={{ flex: 1, gap: 5 }}>
            <AppText style={styles.gameTitle}>{item.name}</AppText>
            {item.first_release_date && (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <CalendarCheck size={14} color={colors.textPrimary} />
                <AppText style={styles.gamedescription}>
                  {getHumanDate(item.first_release_date)}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.rightContainer}
          onPress={() => onPlusPress(item)}
        >
          <ListPlus size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { borderColor: colors.borderStrong }]}
          />
        )}
        data={searchedGames}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <GameItem item={item} onPlusPress={handlePlusPress} />
        )}
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
  loadingWrapper: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamedescription: {
    fontSize: 12,
    alignItems: 'center',
  },

  innerWrap: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
