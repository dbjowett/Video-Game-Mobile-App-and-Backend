import { useGameSearch } from '@/api/hooks/useGameSearch';
import { ListGame } from '@/api/types/game';
import { AppText, View } from '@/components/Themed';
import { getHumanDate, imageLoader } from '@/utils';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { CalendarCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

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

const GameItem = ({ item }: { item: ListGame }) => (
  <TouchableOpacity
    onPress={() => {
      router.dismissAll();
      router.push(`/games/${item.id}`);
    }}
  >
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
              <CalendarCheck size={14} color="black" />
              <AppText style={styles.gamedescription}>
                {getHumanDate(item.first_release_date)}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const Page = () => {
  const [input, onChangeInput] = useState<string>('');
  const debouncedInput = useDebouncedValue(input, 300);

  const headerHeight = useHeaderHeight();

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
      <TextInput
        autoFocus
        style={styles.input}
        placeholder="Search.."
        onChangeText={onChangeInput}
        value={input}
      />
      {(isLoading || isFetching) && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator />
        </View>
      )}

      {noResults && (
        <View style={styles.loadingWrapper}>
          <AppText>No results found</AppText>
        </View>
      )}

      <FlatList
        data={searchedGames}
        keyExtractor={({ id }) => id.toString()}
        renderItem={GameItem}
      />
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

  container: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamedescription: {
    fontSize: 12,
    alignItems: 'center',
  },
  input: {
    maxHeight: 50,
    marginHorizontal: 16,
    fontSize: 18,
    borderColor: '#c2c2c2',
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    padding: 14,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
