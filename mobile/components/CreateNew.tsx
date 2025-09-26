import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { useCreateGameList } from '@/api/hooks/useCreateGameList';
import { DetailedGame } from '@/api/types/game';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { useForm } from '@tanstack/react-form';
import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppButton from './AppButton';
import { AppText } from './Themed';

const CreateNewForm = ({ game }: { game: DetailedGame }) => {
  const { colors } = useTheme();

  const createGameListMutation = useCreateGameList();
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    },

    onSubmit: async ({ value }) => {
      createGameListMutation.mutate({
        title: value.title,
        description: value.description,
        isPublic: value.isPublic,
        gameIds: [game.id],
      });
    },
  });
  return (
    <View style={{ marginBottom: 60 }}>
      <View style={{ marginBottom: 16 }}>
        <AppText style={{ marginBottom: 4 }}>Title</AppText>
        <form.Field
          name="title"
          validators={{
            onSubmit: ({ value }) =>
              !value ? 'Please enter a title' : undefined,
          }}
          children={(field) => (
            <>
              <BottomSheetTextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="List title"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                  },
                ]}
              />
              {field.state.meta.errors?.length > 0 && (
                <AppText style={styles.error}>
                  {field.state.meta.errors.join(', ')}
                </AppText>
              )}
            </>
          )}
        />
      </View>
      <View style={{ marginBottom: 16 }}>
        <AppText style={{ marginBottom: 4 }}>Description</AppText>
        <form.Field
          name="description"
          validators={{
            onSubmit: ({ value }) =>
              !value ? 'Please enter a description' : undefined,
          }}
          children={(field) => (
            <>
              <BottomSheetTextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Description"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                  },
                ]}
              />
              {field.state.meta.errors?.length > 0 && (
                <AppText style={styles.error}>
                  {field.state.meta.errors.join(', ')}
                </AppText>
              )}
            </>
          )}
        />
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

      <AppButton
        leftIcon="FilePlus2"
        variant="dark"
        title="Create List"
        onPress={form.handleSubmit}
      />
    </View>
  );
};

export default CreateNewForm;

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, height: 40, paddingHorizontal: 10 },
  error: {
    marginTop: spacing.xs,
    paddingHorizontal: 12,
    color: 'red',
    fontSize: 12,
    marginBottom: spacing.sm,
  },
});
