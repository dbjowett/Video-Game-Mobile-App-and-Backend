import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import ky from 'ky';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface Values {
  email: string;
  password: string;
}

const Page = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as Values,
    onSubmit: async (data) => {
      isSignUp ? handleSignUp(data) : handleSignIn(data);
    },
  });

  const signUpMutation = useMutation(async (data) => {
    const response = await ky.post('/api/signup', { json: data }).json();
    return response;
  });

  const signInMutation = useMutation(async (data) => {
    const response = await ky.post('/api/login', { json: data }).json();
    return response;
  });

  const handleSignIn = async (data: Values) => {
    try {
      await signInMutation.mutateAsync(data);

      Alert.alert('Success', 'Logged in successfully');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  const handleSignUp = async (data) => {
    try {
      await signUpMutation.mutateAsync(data);
      router.push('/');
      Alert.alert('Success', 'Signed up successfully');
    } catch (error) {
      Alert.alert('Error', 'Sign up failed');
    }
  };

  const toggleSignUpSignIn = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoogleLogin = (url) => {
    console.log('URRL', url);

    // http://localhost:5173/login?token=eyJ...
    if (url.includes('token')) {
      setShowGoogleLogin(false);
      Alert.alert('Success', 'Logged in with Google');
      router.push('/');
    }
  };

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

            <TouchableOpacity onPress={toggleSignUpSignIn}>
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
          onNavigationStateChange={(event) => handleGoogleLogin(event.url)}
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
