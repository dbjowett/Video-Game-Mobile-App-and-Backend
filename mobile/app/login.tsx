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
import { LogIn } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const BANNER_HEIGHT = 300;

const DEFAULT__VALUES = {
  email: '',
  password: '',
};

const Page = () => {
  const { data } = useFetchHero();

  const { signIn } = useSession();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  const signUpMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data) => {
      return await apiNoAuth.post('api/signup', { json: data }).json<Tokens>();
    },
    onSuccess: async ({ access_token, refresh_token }) => signIn({ access_token, refresh_token }),
    onError: (error) => {
      Alert.alert('Something went wrong. Please try again later.');
    },
  });

  const signInMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data: Values): Promise<Tokens> => {
      try {
        return await apiNoAuth.post('auth/signin', { json: data }).json<Tokens>();
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
    setShowGoogleLogin(false);
    router.push('/');
  });

  const form = useForm({
    defaultValues: DEFAULT__VALUES,
    onSubmit: async ({ value }) => {
      isSignUp ? signUpMutation.mutateAsync(value) : signInMutation.mutateAsync(value);
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
            <View style={styles.gridItem}>
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
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <GameLayout />
      </View>

      <View style={styles.lowerContainer}>
        <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        {!showGoogleLogin ? (
          <>
            <TouchableOpacity style={styles.googleButton} onPress={() => setShowGoogleLogin(true)}>
              <GoogleIcon />
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </Text>
            </TouchableOpacity>

            <View style={styles.form}>
              {/* Email Field */}
              <form.Field name="email">
                {(field) => (
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
                      <Text style={styles.error}>{field.state.meta.errors.join(', ')}</Text>
                    )}
                  </>
                )}
              </form.Field>

              {/* Password Field */}
              <form.Field name="password">
                {(field) => (
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
                      <Text style={styles.error}>{field.state.meta.errors.join(', ')}</Text>
                    )}
                  </>
                )}
              </form.Field>

              <TouchableOpacity style={styles.signUpBtn} onPress={form.handleSubmit}>
                <Text style={styles.signUpBtnText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
                <LogIn color="white" size={18} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)}>
                <Text style={styles.toggleText}>
                  {isSignUp ? 'Already have an account? Sign in' : 'Don’t have an account? Sign up'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <WebView
            userAgent="http.agent"
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/auth/google?platform=mobile` }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },

  upperContainer: {
    position: 'fixed',
  },

  lowerContainer: {
    overflow: 'hidden',
    flex: 1,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    transform: [{ rotate: '10deg' }],
    justifyContent: 'center',
  },
  gridItem: {
    padding: 5,
  },

  icon: {
    alignSelf: 'center',
    marginBottom: 40,
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
    marginBottom: 20,
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
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpBtnText: {
    color: '#e3e3e3',
    fontSize: 18,
  },
});

export default Page;
