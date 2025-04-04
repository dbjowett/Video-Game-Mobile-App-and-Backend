import { api } from './api';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthStatus = 'loggedOut' | 'loggedIn' | 'loading';

export class Auth {
  status: AuthStatus = 'loading';
  user: User | null = null;

  async loadUser(): Promise<void> {
    try {
      const user = await api.get('auth/profile').json<User>();
      this.user = user;
      this.status = 'loggedIn';
    } catch (err) {
      console.warn('Failed to load user:', err);
      this.user = null;
      this.status = 'loggedOut';
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('auth/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
    }

    localStorage.removeItem('token');
    this.user = null;
    this.status = 'loggedOut';

    window.location.href = '/login';
  }
}

export const auth = new Auth();
