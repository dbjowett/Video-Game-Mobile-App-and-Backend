export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
  get: async (endpoint: string) => {
    const url = `${BASE_URL}/${endpoint}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};
