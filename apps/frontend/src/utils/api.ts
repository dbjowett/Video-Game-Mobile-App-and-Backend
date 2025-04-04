import ky, { KyInstance, KyResponse } from 'ky';

export const api: KyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response: KyResponse) => {
        if (response.status === 401) {
          try {
            const data = await ky
              .post('auth/refresh', {
                prefixUrl: import.meta.env.VITE_API_URL,
                credentials: 'include',
              })
              .json<{ access_token: string }>();

            if (data?.access_token) {
              localStorage.setItem('token', data.access_token);

              return await api(request, {
                ...options,
                retry: { limit: 0 },
                headers: {
                  ...(options.headers || {}),
                  Authorization: `Bearer ${data.access_token}`,
                },
              });
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            localStorage.removeItem('token');
            location.assign('/login');
          }
        }

        return response;
      },
    ],
  },
});
