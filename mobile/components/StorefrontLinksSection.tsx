import { ExternalLink } from 'lucide-react-native';
import { Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/theme/theme-context';

import { AppText } from './Themed';

type Props = {
  storefronts: { name: string; url: string }[];
};

export const StorefrontLinksSection = ({ storefronts }: Props) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.content}
      showsHorizontalScrollIndicator={false}
    >
      {storefronts.map((storefront) => (
        <TouchableOpacity
          key={storefront.name}
          style={[styles.pill, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => Linking.openURL(storefront.url)}
        >
          <ExternalLink size={16} color={colors.textPrimary} />
          <AppText style={styles.label}>{storefront.name}</AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
    paddingHorizontal: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
  },
});
