import { Tokens } from '@/api/types/auth';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useGoogleCallback = (cb: ({ access_token, refresh_token }: Tokens) => void) => {
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url.includes('vg-app://login')) {
        const params = new URL(url).searchParams;
        const access_token = params.get('token');
        const refresh_token = params.get('refresh');

        if (access_token && refresh_token && cb) {
          cb({ access_token, refresh_token });
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [cb]);
};
