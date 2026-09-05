import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { api } from '@/api/utils/api';
import { deleteTokensFromStore, storeTokens } from '@/api/utils/tokenStorage';

type AuthContextType = {
  signIn: ({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  isLoggedIn: false,
  isLoading: true,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        setIsLoggedIn(true);
      }

      setIsLoading(false);
    };

    void loadSession();
  }, []);

  const signIn = async ({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) => {
    if (!access_token || !refresh_token) {
      throw new Error('No access token received from login');
    }
    await storeTokens({ access_token, refresh_token });
    setIsLoggedIn(true);
    router.push('/');
  };

  const signOut = async () => {
    try {
      await api.post('auth/logout');
    } catch {
      // Ignore server-side logout failures; local session is cleared below regardless.
    }
    await deleteTokensFromStore();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
