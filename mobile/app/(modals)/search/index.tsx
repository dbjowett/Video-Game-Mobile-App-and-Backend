import { useGameSearch } from '@/api/hooks/useGameSearch';
import { View } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const useDebouncedValue = <T,>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [input, onChangeInput] = useState<string>('');

  const debouncedInput = useDebouncedValue(input, 300);

  const { data: searchedGames, isLoading, isFetching } = useGameSearch(debouncedInput);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <TextInput
        autoFocus
        style={styles.input}
        placeholder="Search.."
        onChangeText={onChangeInput}
        value={input}
      />
      {isLoading && <Text>Loading...</Text>}

      <FlatList
        data={searchedGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.dismissAll();
              router.push(`/games/${item.id}`);
            }}
          >
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ flex: 1, gap: 5 }}>
                  <Text style={styles.gameTitle}>{item.value}</Text>
                  <Text style={styles.gamedescription}>{item.description}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamedescription: {
    fontSize: 12,
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
