import { DetailedGame } from '@/api/types/game';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/theme-context';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from './AppButton';
import CreateNewForm from './CreateNew';
import { AppText } from './Themed';

const screenWidth = Dimensions.get('window').width;

interface Props {}

// TODO: GET FROM API
const mockLists = [
  '12 Zelda games',
  'Top Games this year',
  'Sports games',
  'Backlog',
  'Top shooters',
  'Best RPGs',
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

interface CreateNewFormProps {
  game: DetailedGame;
}

const AddToListSheet = forwardRef<BottomSheet, CreateNewFormProps>(
  ({ game }, ref) => {
    const [selected, setSelected] = useState<string>('Top Games this year');
    const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
    const { colors } = useTheme();

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
            },
            isSelected && {
              borderWidth: 1,
              borderColor: colors.primary,
            },
          ]}
        >
          <AppText
            style={[
              styles.cardText,
              {
                color: isSelected ? colors.primary : colors.textPrimary,
              },
            ]}
          >
            {item}
          </AppText>
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
        snapPoints={['50%']}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <AppText style={styles.headerButton}>Cancel</AppText>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', gap: spacing.xs }}>
              <AppText style={styles.headerTitle}>Add To List</AppText>
              <AppText style={{ fontSize: 14, color: colors.textSecondary }}>
                {game.name}
              </AppText>
            </View>

            <TouchableOpacity>
              <AppText style={styles.headerButton}>Save</AppText>
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
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: spacing.md }}
              />
            </View>
          )}
        </View>
      </BottomSheet>
    );
  },
);

export default AddToListSheet;

const cardWidth = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  card: {
    width: cardWidth,
    borderWidth: StyleSheet.hairlineWidth,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontWeight: 500,
  },
});
