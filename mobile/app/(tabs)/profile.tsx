import { useSession } from '@/components/AuthContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Text>Profile</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.googleButton} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
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
});

export default Page;
