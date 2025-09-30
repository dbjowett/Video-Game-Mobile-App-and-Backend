import { DetailedGame, ListGame } from '@/api/types/game';
import AddToListSheet from '@/components/AddToListSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { createContext, useContext, useRef, useState } from 'react';

interface AddToListContextType {
  openAddToListSheet: (game: DetailedGame | ListGame) => void;
  closeAddToListSheet: () => void;
}

const AddToListContext = createContext<AddToListContextType | undefined>(
  undefined,
);

const AddToListProvider = ({ children }: { children: React.ReactNode }) => {
  const addToListSheetRef = useRef<BottomSheet>(null);
  const [selectedGame, setSelectedGame] = useState<
    DetailedGame | ListGame | null
  >(null);
  const openAddToListSheet = (game: DetailedGame | ListGame) => {
    setSelectedGame(game);
    addToListSheetRef.current?.expand();
  };

  const closeAddToListSheet = () => {
    setSelectedGame(null);
    addToListSheetRef.current?.close();
  };

  return (
    <AddToListContext.Provider
      value={{ openAddToListSheet, closeAddToListSheet }}
    >
      {children}
      {selectedGame && (
        <AddToListSheet game={selectedGame} ref={addToListSheetRef} />
      )}
    </AddToListContext.Provider>
  );
};

const useAddToList = () => {
  const context = useContext(AddToListContext);
  if (!context) {
    throw new Error('useAddToList must be used within an AddToListProvider');
  }
  return context;
};

export { useAddToList };
export default AddToListProvider;
