import { useUser } from '@/api/hooks/useUser';
import { useSession } from '@/components/AuthContext';
import { Loader2, LogOut } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const { signOut } = useSession();
  const { data: user, isLoading } = useUser();
  console.log(user);
  if (isLoading) return <Loader2 style={styles.loader} />;

  return (
    <View style={styles.container}>
      <View>
        <Text>Signed in as:</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.googleButton} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
        <LogOut color="white" size="18" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    alignSelf: 'center',
    marginTop: '50%',
    transform: [{ rotate: '360deg' }],
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },

  emailText: {
    fontWeight: 600,
  },

  googleButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    padding: 12,
    gap: 10,
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
