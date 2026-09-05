import * as SecureStore from 'expo-secure-store';

export const storeTokens = async ({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token: string;
}) => {
  await SecureStore.setItemAsync('accessToken', access_token);
  await SecureStore.setItemAsync('refreshToken', refresh_token);
};

export const deleteTokensFromStore = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};
