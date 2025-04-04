export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
