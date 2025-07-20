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
