export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};
