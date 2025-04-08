import * as SecureStore from 'expo-secure-store';
import ky, { HTTPError } from 'ky';

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  credentials: 'include',
  retry: {
    limit: 1,
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const data = await ky
              .post('auth/refresh', {
                json: { refreshToken },
                prefixUrl: process.env.EXPO_PUBLIC_API_URL,
                credentials: 'include',
              })
              .json<{ access_token: string }>();

            if (data?.access_token) {
              await SecureStore.setItemAsync('accessToken', data.access_token);
              request.headers.set('Authorization', `Bearer ${data.access_token}`);
            } else {
              throw new Error('No access token received from refresh');
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            location.assign('/login');
            throw err;
          }
        }
      },
    ],
  },
});

export const apiNoAuth = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  credentials: 'include',
  retry: { limit: 0 },
});
