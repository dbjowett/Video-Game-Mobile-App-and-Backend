export interface Values {
  password: string;
  email: string;
}

export interface Tokens {
  refresh_token: string;
  access_token: string;
}

export interface User {
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  googleId: string;
  email: string;
  id: string;
}
