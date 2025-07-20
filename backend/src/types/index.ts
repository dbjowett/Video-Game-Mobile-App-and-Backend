export interface User {
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  googleId: string;
  email: string;
  id: string;
}

export type BatchPayload = {
  count: number;
};
