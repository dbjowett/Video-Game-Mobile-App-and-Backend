import { useTheme } from '@/theme/theme-context';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const CustomHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation(); // Get navigation object
  const { colors } = useTheme();

  return (
    <View
      style={{
        height: 100,
        backgroundColor: colors.background,
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingHorizontal: 15,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', bottom: 10, left: 15 }}
      >
        <Text style={{ fontSize: 18, color: colors.textPrimary }}>
          {'< Back'}
        </Text>
      </TouchableOpacity>
      <Text
        style={{ fontSize: 30, fontWeight: 'bold', color: colors.textPrimary }}
      >
        {title}
      </Text>
    </View>
  );
};
