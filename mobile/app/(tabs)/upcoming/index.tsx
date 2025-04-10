import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';

export default function Page() {
  const headerHeight = useHeaderHeight();
  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <Text style={styles.title}>Upcoming Games</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
