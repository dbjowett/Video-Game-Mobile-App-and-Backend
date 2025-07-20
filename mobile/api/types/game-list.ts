export type GameList = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GameListItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  listId: string;
  gameId: number;
  position: number;
};
