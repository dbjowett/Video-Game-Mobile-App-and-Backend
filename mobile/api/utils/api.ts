import ky, { KyInstance } from 'ky';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api: KyInstance = ky.create({
  credentials: 'include',
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = 'get token';
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
