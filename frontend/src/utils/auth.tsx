import { useQuery } from '@tanstack/react-query';
import type { User } from '@vg/types';

import { api, apiNoAuth } from './api';

export type AuthStatus = 'loggedOut' | 'loggedIn' | 'loading';

export class Auth {
  status: AuthStatus = 'loading';
  user: User | null = null;

  async loadUser(): Promise<void> {
    if (this.status !== 'loading') return;

    try {
      const user = await api.get('profile').json<User>();
      this.user = user;
      this.status = 'loggedIn';
    } catch {
      this.user = null;
      this.status = 'loggedOut';
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('auth/logout');
    } catch {
      // Ignore server-side logout failures; local session is cleared below regardless.
    }

    localStorage.removeItem('token');
    this.user = null;
    this.status = 'loggedOut';

    globalThis.location.href = '/login';
  }
}

export const auth = new Auth();

export const useUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: () => apiNoAuth.get('profile').json<User>(),
  });
