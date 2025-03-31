export type User = {
  id: string;
  email: string;
  name: string;
};

export const auth: Auth = {
  status: 'loggedOut',
  user: undefined,
};

export type Auth = {
  status: 'loggedOut' | 'loggedIn';
  user?: User;
};

export const checkAuth = async (): Promise<Auth> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies (session) are sent
    });
    // const res = await api.get('/auth/profile');
    const data = await response.json();

    if (data.isAuthenticated) {
      return {
        status: 'loggedIn',
        user: data.user,
      };
    } else {
      return {
        status: 'loggedOut',
      };
    }
  } catch {
    return {
      status: 'loggedOut',
    };
  }
};

export const initializeAuth = async () => {
  const auth = await checkAuth();
  return auth;
};
