export interface GameList {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  _count: { items: number };
}

export interface GameListWithCovers extends GameList {
  items: Array<{ gameId: string; gameCoverUrl: string }>;
}

export type GameListItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  listId: string;
  gameId: number;
  position: number;
};
