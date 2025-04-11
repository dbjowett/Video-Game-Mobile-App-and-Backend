import { useUpdateUser } from '@/api/hooks/useUpdateUser';
import { useUser } from '@/api/hooks/useUser';
import { useSession } from '@/components/AuthContext';
import { Text, View } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { Loader2, LogOut, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { signOut } = useSession();
  const { data: user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');

  const { mutate } = useUpdateUser();

  if (isLoading) return <Loader2 style={styles.loader} />;

  const handleSave = async () => {
    mutate({ username: newUsername });
    setIsEditing(false);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setNewUsername(user?.username || ''); // Reset to the original username
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.profileContainer}>
        {/* Profile Picture */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user?.profileImage }} // Use the user's profile image or a default one
            style={styles.profileImage}
          />
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.usernameInput}
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>{user?.username}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Email */}
        <Text style={styles.emailText}>{user?.email}</Text>

        {/* Logout */}
        <TouchableOpacity style={styles.googleButton} onPress={signOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
          <LogOut color="white" size={18} />
        </TouchableOpacity>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  profileContainer: {
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    color: '#4285F4',
    fontSize: 12,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },

  emailText: {
    fontSize: 16,
    color: '#666',
  },
  googleButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    padding: 12,
    gap: 10,
    borderRadius: 8,
    minWidth: 160,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Page;
