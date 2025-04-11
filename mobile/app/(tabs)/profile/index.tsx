import { useUpdateUser } from '@/api/hooks/useUpdateUser';
import { useUser } from '@/api/hooks/useUser';
import { useSession } from '@/components/AuthContext';
import { Text, View as ThemedView } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { CircleUserRound, CircleX, Loader2, LogOut, Pencil, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { signOut } = useSession();
  const { data: user, isLoading } = useUser();
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');

  const { mutate } = useUpdateUser();

  if (isLoading) return <Loader2 style={styles.loader} />;

  const handleSave = async () => {
    if (newUsername.trim() !== user?.username) {
      mutate({ username: newUsername });
    }
    setIsEditingName(false);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setNewUsername(user?.username || ''); // Reset to the original username
    setIsEditingName(false);
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.profileContainer}>
        {/* Profile Picture */}
        <View style={styles.imageContainer}>
          {user?.profileImage ? (
            <Image
              source={{ uri: user?.profileImage }} // Use the user's profile image or a default one
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImage}>
              <CircleUserRound color="white" size={40} />
            </View>
          )}
          {/* <TouchableOpacity style={styles.editImgIconContainer} onPress={handleEditImg}>
            <Pencil color="white" size={18} />
          </TouchableOpacity> */}
        </View>

        <ThemedView style={styles.itemWrap}>
          <Text style={styles.subtext}>Username</Text>

          {isEditingName ? (
            <View>
              <TextInput
                style={styles.mainText}
                value={newUsername}
                onChangeText={setNewUsername}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.mainText}>{user?.username}</Text>
            </View>
          )}

          <View style={styles.editUserIconWrap}>
            {!isEditingName ? (
              <TouchableOpacity style={styles.editUserIcon} onPress={() => setIsEditingName(true)}>
                <Pencil color="white" size={18} />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.editUserIcon} onPress={handleCancel}>
                  <CircleX color="white" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editUserIcon} onPress={handleSave}>
                  <Save color="white" size={18} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </ThemedView>
        {/* Email */}
        <ThemedView style={styles.itemWrap}>
          <Text style={styles.subtext}>Email</Text>
          <Text style={styles.mainText}>{user?.email}</Text>
        </ThemedView>

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
    gap: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 3,
  },
  itemWrap: {
    padding: 14,
    borderRadius: 8,
    width: '80%',
    gap: 4,
    position: 'relative',
  },
  subtext: {
    fontSize: 12,
    color: '#6B7181',
  },

  editImgIconContainer: {
    position: 'absolute',
    right: 0,
    top: 4,
    opacity: 0.5,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 4,
  },
  profileImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BCC0C4',
  },

  editUserIconWrap: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    top: -10,
    right: -10,
  },
  editUserIcon: {
    opacity: 0.3,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 4,
  },

  mainText: {
    fontSize: 18,
    fontWeight: 500,
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

  googleButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4285F4',

    height: 52,
    gap: 10,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Page;
