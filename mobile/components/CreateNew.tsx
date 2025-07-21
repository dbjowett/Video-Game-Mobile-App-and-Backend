import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { useTheme } from '@/theme/theme-context';
import { Check } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from './Themed';

const CreateNewForm = ({ form }: { form: unknown }) => {
  const { colors } = useTheme();

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
          <form.Field
            name="title"
            children={(field) => (
              <BottomSheetTextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="List title"
                style={{ height: 40, color: colors.textPrimary }}
              />
            )}
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
          <form.Field
            name="description"
            children={(field) => (
              <BottomSheetTextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Description (optional)"
                style={{ height: 40, color: colors.textPrimary }}
              />
            )}
          />
        </View>
      </View>
      <form.Field
        name="isPublic"
        children={({ handleChange, state }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
            onPress={() => handleChange(!state.value)}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: state.value
                  ? colors.primary
                  : colors.background,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {state.value && <Check size={14} strokeWidth={4} color="#fff" />}
            </View>
            <AppText>Public</AppText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CreateNewForm;
