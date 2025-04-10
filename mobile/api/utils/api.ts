import { deleteTokensFromStore, storeTokens } from '@/components/AuthContext';
import * as SecureStore from 'expo-secure-store';
import ky from 'ky';
import { Tokens } from '../types/auth';

export const apiNoAuth = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  credentials: 'include',
  retry: { limit: 0 },
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
      async (request, _, response) => {
        if (response.status === 401) {
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const data = await apiNoAuth
              .post('auth/refresh', { json: { refreshToken } })
              .json<Tokens>();

            if (data?.access_token && data?.refresh_token) {
              const { access_token, refresh_token } = data;
              await storeTokens({ access_token, refresh_token });
            } else {
              throw new Error('No access token received from refresh');
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            await deleteTokensFromStore();
            location.assign('/login');
            throw err;
          }
        }
      },
    ],
  },
});
