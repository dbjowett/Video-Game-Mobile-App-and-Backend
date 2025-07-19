import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/theme-context';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from './AppButton';
import CreateNewForm from './CreateNew';
import { BlueText } from './StyledText';
import { AppText } from './Themed';

const screenWidth = Dimensions.get('window').width;

interface Props {}

// TODO: GET FROM API
const mockLists = [
  '12 Zelda games',
  'Top Games this year',
  'Sports games',
  'Backlog',
  // 'Top shooters',
  // 'Best RPGs',
  // 'Indie gems',
  // 'Games I regret buying',
  // 'Childhood favorites',
  // 'Best pixel art games',
  // 'Wishlist 2025',
  // 'Games with great soundtracks',
  // 'Completed in 2024',
  // 'Most anticipated',
  // 'Hardest games ever',
  // 'Top co-op games',
  // 'Short and sweet',
  // 'Great storytelling',
  // 'Comfort games',
  // 'Multiplayer only',
  // 'Retro classics',
  // 'Games to replay',
  // 'Mobile must-plays',
  // 'Underrated titles',
  // 'AAA disappointments',
  // 'Steam Deck picks',
  // 'Free-to-play only',
  // 'Hidden horror gems',
  // 'Games to stream',
  // 'Open world adventures',
];

const AddToListSheet = forwardRef<BottomSheet, Props>((_props, ref) => {
  const [selected, setSelected] = useState<string>('Top Games this year');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const { colors } = useTheme();

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet index:', index);
  }, []);

  const handleCancel = () => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.close();
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selected;

    return (
      <TouchableOpacity
        onPress={() => setSelected(item)}
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth,
          },
          isSelected && {
            borderWidth: 1,
            borderColor: '#000',
          },
        ]}
      >
        <AppText style={styles.cardText}>{item}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheet
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.surface }}
      ref={ref}
      index={-1}
      snapPoints={['50%', '90%']}
      onChange={handleSheetChanges}
    >
      <View style={styles.sheetContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <AppText style={styles.headerButton}>Cancel</AppText>
          </TouchableOpacity>

          <AppText style={styles.headerTitle}>Add To List</AppText>

          <TouchableOpacity>
            <BlueText style={styles.headerButton}>Save</BlueText>
          </TouchableOpacity>
        </View>

        {isCreatingNew ? (
          <View style={{ flex: 1, gap: spacing.md }}>
            <AppButton
              title="Add to Existing"
              onPress={() => setIsCreatingNew(false)}
              variant="default"
              size="md"
              fontSize="md"
              borderRadius="md"
              leftIcon="ListEnd"
            />
            <CreateNewForm />
          </View>
        ) : (
          <View style={{ flex: 1, gap: spacing.md }}>
            <AppButton
              title="Create New"
              onPress={() => setIsCreatingNew(true)}
              variant="default"
              size="md"
              fontSize="md"
              borderRadius="md"
              leftIcon="ListPlus"
            />
            <FlatList
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
              data={mockLists}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              numColumns={3}
              columnWrapperStyle={styles.row}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

export default AddToListSheet;

const cardWidth = (screenWidth - 60) / 3;

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    width: cardWidth,
    height: 80,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    textAlign: 'center',
    fontWeight: 500,
    fontSize: 14,
  },
});
