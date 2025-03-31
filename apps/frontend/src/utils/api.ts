import ky, { KyResponse } from 'ky';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (_, __, response: KyResponse) => {
        if (response.status === 403) {
          location.assign('/login');
          return;
        }
        return response;
      },
    ],
  },
});
