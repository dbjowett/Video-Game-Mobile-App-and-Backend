import { deleteTokensFromStore, storeTokens } from '@/components/AuthContext';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import ky from 'ky';
import { Tokens } from '../types/auth';

export const apiNoAuth = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  credentials: 'include',
  retry: { limit: 0 },
  headers: {
    'Content-Type': 'application/json',
  },
  throwHttpErrors: true,
});

export const api = apiNoAuth.extend({
  retry: {
    limit: 1,
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`);
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401) {
          try {
            const newTokens = await refreshToken();

            if (!newTokens) {
              await deleteTokensFromStore();
              router.navigate('/login');
              return;
            }

            if (newTokens?.access_token && newTokens?.refresh_token) {
              const { access_token, refresh_token } = newTokens;
              await storeTokens({ access_token, refresh_token });
            } else {
              throw new Error('No access token received from refresh');
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            await deleteTokensFromStore();
            router.navigate('/login');
            throw err;
          }
        }
      },
    ],
  },
});

async function refreshToken() {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  if (!refreshToken) {
    await deleteTokensFromStore();
    router.navigate('/login');
    return null;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${refreshToken}`,
  };

  const data = await apiNoAuth.post('auth/refresh', { headers }).json<Tokens>();

  if (data?.access_token && data?.refresh_token) {
    await storeTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
    return data;
  }

  throw new Error('No access token received from refresh');
}
