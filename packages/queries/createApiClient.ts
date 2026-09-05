import ky, { KyInstance } from 'ky';

export interface CreateApiClientParams {
  baseUrl: string | undefined;
  getAccessToken: () => Promise<string | null> | string | null;
}

// Only the safe, identical-on-both-platforms shape lives here: attaching the access
// token and the base retry-once-on-401 config. The actual refresh-token transport
// differs by design (web: httpOnly cookie, invisible to JS; mobile: explicit token in
// SecureStore) and stays platform-specific in each app's own api.ts.
export const createApiClient = ({ baseUrl, getAccessToken }: CreateApiClientParams) => {
  const apiNoAuth: KyInstance = ky.create({
    prefix: baseUrl,
    credentials: 'include',
    retry: { limit: 0 },
  });

  const api: KyInstance = apiNoAuth.extend({
    retry: { limit: 1, statusCodes: [401] },
    hooks: {
      beforeRequest: [
        async ({ request }) => {
          const token = await getAccessToken();
          if (token) request.headers.set('Authorization', `Bearer ${token}`);
        },
      ],
    },
  });

  return { api, apiNoAuth };
};
