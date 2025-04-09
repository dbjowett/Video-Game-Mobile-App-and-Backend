import { api } from '@/api/utils/api';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  signIn: ({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  session: null,
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
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        setSession(accessToken);
      }

      setIsLoading(false);
    };

    loadSession();
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
    await SecureStore.setItemAsync('accessToken', access_token);
    await SecureStore.setItemAsync('refreshToken', refresh_token);
    setSession(access_token);
    router.push('/');
  };

  const signOut = async () => {
    try {
      await api.post('auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setSession(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
