import { Tokens, Values } from '@/api/types/auth';
import { apiNoAuth } from '@/api/utils/api';
import { useSession } from '@/components/AuthContext';
import { useGoogleCallback } from '@/hooks/useGoogleCallback';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT__VALUES = {
  email: '',
  password: '',
};

const Page = () => {
  const { signIn } = useSession();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  const signUpMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data) => {
      return await apiNoAuth.post('/api/signup', { json: data }).json<Tokens>();
    },
    onSuccess: async ({ access_token, refresh_token }) => signIn({ access_token, refresh_token }),
  });

  const signInMutation = useMutation<Tokens, Error, Values>({
    mutationFn: async (data: Values): Promise<Tokens> => {
      return await apiNoAuth.post('/auth/signin', { json: data }).json<Tokens>();
    },
    onSuccess: async ({ access_token, refresh_token }) => signIn({ access_token, refresh_token }),
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      {!showGoogleLogin ? (
        <>
          <TouchableOpacity style={styles.googleButton} onPress={() => setShowGoogleLogin(true)}>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.form}>
            {/* Email Field */}
            <form.Field name="email">
              {(field) => (
                <>
                  <Text>Email:</Text>
                  <TextInput
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

            <Button title={isSignUp ? 'Sign Up' : 'Sign In'} onPress={form.handleSubmit} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
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
});

export default Page;
