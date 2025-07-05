import { useFetchHero } from '@/api/hooks/useGetPopular';
import { Tokens, Values } from '@/api/types/auth';
import { apiNoAuth } from '@/api/utils/api';
import { useSession } from '@/components/AuthContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import { useGoogleCallback } from '@/hooks/useGoogleCallback';
import { imageLoader } from '@/utils';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { WebView } from 'react-native-webview';

const BANNER_HEIGHT = 300;

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

const Page = () => {
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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
      } catch (error) {
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

  useGoogleCallback(({ access_token, refresh_token }) => {
    signIn({ access_token, refresh_token });
    router.push('/');
    setShowGoogleLogin(false);
  });

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: (vals) => {
        console.log('Vals:', vals);
      },
    },
    onSubmit: async ({ value }) => {
      isSignUp
        ? signUpMutation.mutateAsync(value)
        : signInMutation.mutateAsync(value);
    },
  });

  const GameLayout = () => {
    return (
      <View
        style={{
          height: BANNER_HEIGHT,
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.7)',
            'rgba(255, 255, 255, 0.95)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
          ]}
          style={styles.gradient}
        />
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

  return (
    <>
      {showGoogleLogin ? (
        <WebView
          style={{ marginTop: 80 }}
          userAgent="http.agent"
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}/auth/google?platform=mobile`,
          }}
        />
      ) : (
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
                  <Text style={styles.header}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Text>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => setShowGoogleLogin(true)}
                  >
                    <GoogleIcon />
                    <Text style={styles.buttonText}>Continue with Google</Text>
                  </TouchableOpacity>

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
                          <Text>Email:</Text>
                          <TextInput
                            autoCapitalize="none"
                            style={styles.input}
                            placeholder="Email"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                          />
                          {field.state.meta.errors && (
                            <Text style={styles.error}>
                              {field.state.meta.errors.join(', ')}
                            </Text>
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
                          <Text>Password:</Text>
                          <TextInput
                            autoCapitalize="none"
                            style={styles.input}
                            placeholder="Password"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            secureTextEntry
                          />
                          {field.state.meta.errors && (
                            <Text style={styles.error}>
                              {field.state.meta.errors.join(', ')}
                            </Text>
                          )}
                        </>
                      )}
                    />

                    <TouchableOpacity
                      style={styles.signUpBtn}
                      onPress={form.handleSubmit}
                    >
                      <Text style={styles.signUpBtnText}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setIsSignUp((prev) => !prev)}
                    >
                      <Text style={styles.toggleText}>
                        {isSignUp
                          ? 'Already have an account? Sign in'
                          : 'Don’t have an account? Sign up'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </>
          </KeyboardAwareScrollView>
        </View>
      )}
    </>
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
    marginBottom: 10,
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
