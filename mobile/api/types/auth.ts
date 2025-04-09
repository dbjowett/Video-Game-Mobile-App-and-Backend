export interface Values {
  email: string;
  password: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  createdAt: string;
  updatedAt: string;
  googleId: string;
  email: string;
  name: string;
  id: string;
}
