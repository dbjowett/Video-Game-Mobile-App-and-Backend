import { useColours } from '@/hooks/useColours';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import {
  CarFront,
  Crosshair,
  Dices,
  Gamepad,
  Gamepad2,
  Hammer,
  ListFilter,
  Swords,
  Volleyball,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ICON_SIZE = 26;
const ICON_COLOUR = '#000';

const categories = [
  {
    name: 'All',
    icon: <Gamepad2 size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'RPG',
    icon: <Swords size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Shooter',
    icon: <Crosshair size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Indie',
    icon: <Hammer size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Sports',
    icon: <Volleyball size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Strategy',
    icon: <Dices size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Racing',
    icon: <CarFront size={ICON_SIZE} color={ICON_COLOUR} />,
  },
  {
    name: 'Platform',
    icon: <Gamepad size={ICON_SIZE} color={ICON_COLOUR} />,
  },
] as const;

interface Props {
  onCategoryChange: (category: string) => void;
}

const CategoryHeader = ({ onCategoryChange }: Props) => {
  const itemsRef = useRef<Array<View>>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);
  const selectCategory = (idx: number) => {
    const selectedItem = itemsRef.current[idx];
    setActiveIdx(idx);
    selectedItem.measure((x) => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCategoryChange(categories[idx].name);
  };

  const colours = useColours();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colours.background }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/search'} asChild>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ fontWeight: 600 }}>Search</Text>
                <Text style={{ color: colours.text }}>Find your new favourite</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity>
            <ListFilter color={ICON_COLOUR} />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 30,
            paddingHorizontal: 16,
          }}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.name}
              ref={(el) => {
                if (!el) return;
                itemsRef.current[idx] = el;
              }}
              style={activeIdx === idx ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(idx)}
            >
              {cat.icon}
              <Text style={activeIdx === idx ? styles.categoryTextActive : styles.categoryText}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 130,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },

  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderColor: '#c2c2c2',
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    padding: 14,
    borderRadius: 30,
    backgroundColor: '#fff',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  categoryText: {
    fontSize: 14,
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#000',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});

export default CategoryHeader;
