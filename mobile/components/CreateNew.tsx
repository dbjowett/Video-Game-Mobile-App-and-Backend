import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { Check } from 'lucide-react-native';
import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from './Themed';

interface FormData {
  title: string;
  description: string;
  isPublic: boolean;
}

const CreateNewForm = ({
  setData,
  data,
}: {
  setData: Dispatch<SetStateAction<FormData>>;
  data: FormData;
}) => {
  const { colors } = useTheme();

  const handleChange = (name: string, value: string | boolean) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <View style={{ marginBottom: 60 }}>
      <View style={{ marginBottom: 16 }}>
        <AppText style={{ marginBottom: 4 }}>Title</AppText>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: colors.background,
          }}
        >
          <BottomSheetTextInput
            value={data.title}
            onChangeText={(e) => handleChange('title', e)}
            placeholder="List title"
            style={{ height: 40 }}
          />
        </View>
      </View>
      <View style={{ marginBottom: 16 }}>
        <AppText style={{ marginBottom: 4 }}>Description</AppText>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: colors.background,
          }}
        >
          <BottomSheetTextInput
            value={data.description}
            onChangeText={(e) => handleChange('description', e)}
            placeholder="Description (optional)"
            style={{ height: 40 }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
        onPress={() => handleChange('isPublic', !data.isPublic)}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: data.isPublic ? colors.primary : colors.background,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {data.isPublic && <Check size={14} strokeWidth={4} color="#fff" />}
        </View>
        <AppText>Public</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewForm;
