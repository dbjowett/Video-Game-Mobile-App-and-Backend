import { createApiClient } from '@vg/queries/createApiClient';
import { Tokens } from '@vg/types';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { deleteTokensFromStore, storeTokens } from '@/api/utils/tokenStorage';

const { api: baseApi, apiNoAuth } = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  getAccessToken: () => SecureStore.getItemAsync('accessToken'),
});

export const api = baseApi.extend({
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async ({ response }) => {
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
          } catch (error) {
            await deleteTokensFromStore();
            router.navigate('/login');
            throw error;
          }
        }
      },
    ],
  },
});

export { apiNoAuth };

async function refreshToken() {
  const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

  if (!storedRefreshToken) {
    await deleteTokensFromStore();
    router.navigate('/login');
    return null;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${storedRefreshToken}`,
  };

  const data = await apiNoAuth.post('auth/refresh', { headers }).json<Tokens>();

  if (data?.access_token && data?.refresh_token) {
    await storeTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
    return data;
  }

  throw new Error('No access token received from refresh');
}
