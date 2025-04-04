import ky, { HTTPError, KyInstance } from 'ky';

export const api: KyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  retry: {
    limit: 1,
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          try {
            const data = await ky
              .post('auth/refresh', {
                prefixUrl: import.meta.env.VITE_API_URL,
                credentials: 'include',
              })
              .json<{ access_token: string }>();

            if (data?.access_token) {
              localStorage.setItem('token', data.access_token);
              request.headers.set('Authorization', `Bearer ${data.access_token}`);
            } else {
              throw new Error('No access token received from refresh');
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            localStorage.removeItem('token');
            location.assign('/login');
            throw err;
          }
        }
      },
    ],
  },
});
