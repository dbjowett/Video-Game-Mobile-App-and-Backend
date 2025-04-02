// import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { isLoaded } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

enum oauth_providers {
  // https://clerk.com/docs/authentication/social-connections/apple
  apple = 'apple',
  // https://clerk.com/docs/authentication/social-connections/facebook
  facebook = 'facebook',
  // https://clerk.com/docs/authentication/social-connections/google
  google = 'google',
}

const Page = () => {
  // useWarmUpBrowser();
  const router = useRouter();

  const loginWithProvider = async (provider: oauth_providers) => {
    const selected = {
      [oauth_providers.apple]: () => '',
      [oauth_providers.google]: () => '',
      [oauth_providers.facebook]: () => '',
    }[provider];

    selected();
  };

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
    Alert.alert('Loggining');
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnOutline}
        onPress={() => loginWithProvider(oauth_providers.apple)}
      >
        {/* <Ionicons name="logo-apple" size={22} style={defaultStyles.btnIcon} /> */}
        <Text style={styles.btnOutlineText} onPress={onSignInPress}>
          Continue with Apple
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnOutline}
        onPress={() => loginWithProvider(oauth_providers.google)}
      >
        {/* <Ionicons name="logo-google" size={22} style={defaultStyles.btnIcon} /> */}
        <Text style={styles.btnOutlineText} onPress={onSignInPress}>
          Continue with Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnOutline}
        onPress={() => loginWithProvider(oauth_providers.facebook)}
      >
        {/* <Ionicons name="logo-facebook" size={22} style={defaultStyles.btnIcon} /> */}
        <Text style={styles.btnOutlineText} onPress={onSignInPress}>
          Continue with Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#fff`,
    padding: 26,
    gap: 20,
  },
  separatorView: {
    gap: 10,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    color: Colors.grey,
    marginBottom: 3,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    height: 50,
    borderColor: Colors.grey,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
  },
});

export default Page;
