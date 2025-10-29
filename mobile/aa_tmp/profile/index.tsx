import { useUpdateUser } from '@/api/hooks/useUpdateUser';
import { useUser } from '@/api/hooks/useUser';
import AppButton from '@/components/AppButton';
import { useSession } from '@/components/AuthContext';
import { AppText, View } from '@/components/Themed';
import { useTheme } from '@/theme/theme-context';

import { useHeaderHeight } from '@react-navigation/elements';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { CameraIcon, CircleUserRound } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const Page = () => {
  const headerHeight = useHeaderHeight();
  const { signOut } = useSession();
  const { data: user, isLoading } = useUser();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const { mutate } = useUpdateUser();

  if (isLoading)
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator />
      </View>
    );

  const handleSave = async () => {
    if (newUsername.trim() !== user?.username) {
      mutate({ username: newUsername });
    }
  };

  const handleEditImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginTop: 56, flexDirection: 'row', gap: 10 }}>
          {/* <TouchableOpacity
            onPress={() => {
              if (image) setImage(null);
              setIsEditing((prev) => !prev);
            }}
          >
            <AppText>Save</AppText>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              if (image) setImage(null);
              setIsEditing((prev) => !prev);
            }}
          >
            {/* <AppText style={{ color: colors.primary, fontWeight: 500 }}>
              {isEditing ? 'Cancel' : 'Edit'}
            </AppText> */}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isEditing, image]);

  const ProfileImage = () => {
    return (
      <View style={styles.imageContainer}>
        {user?.profileImage || image ? (
          <Image
            source={{ uri: image || user?.profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImage}>
            <CircleUserRound color="white" size={40} />
          </View>
        )}

        {isEditing ? (
          <TouchableOpacity
            style={styles.editImageOverlayWrap}
            onPress={handleEditImg}
          >
            <View style={styles.editImageOverlay} />

            <CameraIcon color="white" size={28} />
            <AppText>Edit</AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.profileContainer}>
        <ProfileImage />
        <View
          style={StyleSheet.flatten([
            styles.itemWrap,
            { borderColor: colors.border },
          ])}
        >
          <AppText
            style={StyleSheet.flatten([
              styles.subtext,
              { color: colors.textSecondary },
            ])}
          >
            Username
          </AppText>

          {isEditing ? (
            <View>
              <TextInput
                autoFocus
                style={styles.mainText}
                value={newUsername}
                onChangeText={setNewUsername}
              />
            </View>
          ) : (
            <View>
              <AppText style={styles.mainText}>{user?.username}</AppText>
            </View>
          )}
        </View>
        {/* Email */}
        <View
          style={StyleSheet.flatten([
            styles.itemWrap,
            { borderColor: colors.border },
          ])}
        >
          <AppText
            style={StyleSheet.flatten([
              styles.subtext,
              { color: colors.textSecondary },
            ])}
          >
            Email
          </AppText>
          <AppText style={styles.mainText}>{user?.email}</AppText>
        </View>

        <AppButton
          style={{ width: '80%' }}
          title="Sign Out"
          onPress={signOut}
          rightIcon="LogOut"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  itemWrap: {
    height: 52,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: '80%',
    gap: 4,
    position: 'relative',
    borderWidth: StyleSheet.hairlineWidth,
  },
  subtext: {
    fontSize: 12,
    color: '#6B7181',
  },

  editImgIconContainer: {
    position: 'absolute',
    right: 0,
    top: 4,
    opacity: 0.2,
    borderWidth: 1,
    borderRadius: 50,
    padding: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BCC0C4',
  },

  editImageOverlay: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000000ff',
    opacity: 0.3,
    position: 'absolute',
  },
  editImageOverlayWrap: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  editUserIconWrap: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    top: -10,
    right: -10,
  },
  editUserIcon: {
    opacity: 0.6,
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

  signOut: {
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
