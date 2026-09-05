import { notifications } from '@mantine/notifications';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { auth } from '../utils/auth';

export const useOAuthTokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(globalThis.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      url.searchParams.delete('token');
      globalThis.history.replaceState({}, document.title, url.pathname);

      void auth.loadUser().then(() => {
        notifications.show({
          title: 'Successfully logged in!',
          message: '',
        });
        void navigate({ to: '/' });
      });
    }
  }, [navigate]);
};
