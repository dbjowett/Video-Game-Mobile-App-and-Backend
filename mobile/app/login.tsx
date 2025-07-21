import { useFetchHero } from '@/api/hooks/useGetPopular';
import { Tokens, Values } from '@/api/types/auth';
import { apiNoAuth } from '@/api/utils/api';
import { useSession } from '@/components/AuthContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import { imageLoader } from '@/utils';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { AppText } from '@/components/Themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BANNER_HEIGHT = 300;

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

const Page = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const router = useRouter();
  const { data } = useFetchHero();
  const { signIn } = useSession();

  const signUpMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data) => {
      return await apiNoAuth.post('api/signup', { json: data }).json<Tokens>();
    },
    onSuccess: async ({ access_token, refresh_token }) =>
      signIn({ access_token, refresh_token }),
    onError: (error) => {
      Alert.alert('Something went wrong. Please try again later.');
    },
  });

  const signInMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data: Values): Promise<Tokens> => {
      try {
        return await apiNoAuth
          .post('auth/signin', { json: data })
          .json<Tokens>();
      } catch {
        throw new Error('Error logging in');
      }
    },
    onSuccess: async ({ access_token, refresh_token }) => {
      signIn({ access_token, refresh_token });
    },
    onError: (error) => {
      Alert.alert('Please check your credentials or make an account');
    },
  });

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    // TODO: Implement validation
    validators: {
      onSubmit: (vals) => {
        console.log('Vals:', vals);
      },
    },
    onSubmit: async ({ value }) => {
      if (isSignUp) {
        signUpMutation.mutateAsync(value);
      } else {
        signInMutation.mutateAsync(value);
      }
    },
  });

  const lightModeColors = [
    'transparent',
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.7)',
    'rgba(255, 255, 255, 0.95)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
  ] as const;

  const darkModeColors = [
    'transparent',
    'rgba(19, 19, 20, 0.5)',
    'rgba(19, 19, 20, 0.7)',
    'rgba(19, 19, 20, 0.95)',
    'rgba(19, 19, 20, 1)',
    'rgba(19, 19, 20, 1)',
  ] as const;

  // TODO: maybe this can be stored in useTheme() (and maybe theme dark vs light can be returned from there )
  const gradientColorArr =
    useColorScheme() === 'dark' ? darkModeColors : lightModeColors;

  const GameLayout = () => {
    return (
      <View
        style={{
          height: BANNER_HEIGHT,
        }}
      >
        <LinearGradient colors={gradientColorArr} style={styles.gradient} />
        <View style={styles.grid}>
          {data?.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <Image
                source={{
                  uri: imageLoader({
                    src: item.cover?.url,
                    quality: 3,
                  }),
                }}
                style={{ width: 100, height: 160, borderRadius: 8 }}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleGoogleLogin = async () => {
    const redirectUri = 'vg-app://login';
    const authUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/google?platform=mobile`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
      );

      if (result.type === 'success' && result.url) {
        console.log('OAuth flow completed with URL:', result.url);

        if (result.url.includes('vg-app://login')) {
          const params = new URL(result.url).searchParams;
          const access_token = params.get('token');
          const refresh_token = params.get('refresh');

          if (access_token && refresh_token) {
            signIn({ access_token, refresh_token });
            router.replace('/(tabs)');
          }
        }
      } else if (result.type === 'dismiss') {
        console.log('User dismissed the login');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <>
          <View style={styles.upperContainer}>
            <GameLayout />
          </View>

          <View style={styles.lowerContainer}>
            <>
              {/* Header */}
              <AppText style={styles.header}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </AppText>

              {/* Google Sign in */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
              >
                <GoogleIcon />
                <AppText style={styles.buttonText}>
                  Continue with Google
                </AppText>
              </TouchableOpacity>

              {/* Form */}
              <View style={styles.form}>
                {/* Email Field */}
                <form.Field
                  name="email"
                  validators={{
                    onSubmit: ({ value }) =>
                      !value
                        ? 'Please enter an email'
                        : !value.includes('@')
                          ? 'Please enter a valid email'
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <AppText style={{ marginBottom: 6 }}>Email:</AppText>
                      <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder="Email"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                      />
                      {field.state.meta.errors && (
                        <AppText style={styles.error}>
                          {field.state.meta.errors.join(', ')}
                        </AppText>
                      )}
                    </>
                  )}
                />

                {/* Password Field */}
                <form.Field
                  name="password"
                  validators={{
                    onSubmit: ({ value }) =>
                      value.length < 3
                        ? 'Password must be at least 3 characters in length'
                        : undefined,
                  }}
                  children={(field) => (
                    <>
                      <AppText style={{ marginBottom: 6 }}>Password:</AppText>
                      <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder="Password"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        secureTextEntry
                      />
                      {field.state.meta.errors && (
                        <AppText style={styles.error}>
                          {field.state.meta.errors.join(', ')}
                        </AppText>
                      )}
                    </>
                  )}
                />

                <TouchableOpacity
                  style={styles.signUpBtn}
                  onPress={form.handleSubmit}
                >
                  <AppText style={styles.signUpBtnText}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)}>
                  <AppText style={styles.toggleText}>
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : 'Don’t have an account? Sign up'}
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  upperContainer: {},

  lowerContainer: {
    paddingHorizontal: 20,
  },

  gradient: {
    zIndex: 0,
    position: 'absolute',
    right: 0,
    bottom: -130,
    height: 250,
    width: '100%',
  },

  grid: {
    zIndex: -1,
    position: 'absolute',
    height: BANNER_HEIGHT,
    top: -BANNER_HEIGHT / 2 + 40,
    width: 500,
    left: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    transform: [{ rotate: '10deg' }],
    justifyContent: 'center',
  },
  gridItem: {
    padding: 5,
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#131314',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#747775',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#e3e3e3',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16,
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  toggleText: {
    textAlign: 'center',
    color: '#007BFF',
    marginTop: 20,
  },
  signUpBtn: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#131314',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    borderColor: '#747775',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpBtnText: {
    color: '#e3e3e3',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16,
  },
});

export default Page;
