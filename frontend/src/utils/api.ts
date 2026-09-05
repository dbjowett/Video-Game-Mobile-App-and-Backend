import { createApiClient } from '@vg/queries/createApiClient';
import { HTTPError } from 'ky';

const { api: baseApi, apiNoAuth } = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getAccessToken: () => localStorage.getItem('token'),
});

export const api = baseApi.extend({
  hooks: {
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          try {
            const data = await apiNoAuth.post('auth/refresh').json<{ access_token: string }>();

            if (data?.access_token) {
              localStorage.setItem('token', data.access_token);
              request.headers.set('Authorization', `Bearer ${data.access_token}`);
            } else {
              throw new Error('No access token received from refresh');
            }
          } catch (refreshError) {
            localStorage.removeItem('token');
            location.assign('/login');
            throw refreshError;
          }
        }
      },
    ],
  },
});

export { apiNoAuth };
