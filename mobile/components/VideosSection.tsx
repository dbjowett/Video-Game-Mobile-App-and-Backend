import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  videos: { id: number; video_id: string; name: string }[];
};

export const VideosSection = ({ videos }: Props) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.subtitle}>Videos</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.screenshotsContent}
        style={styles.screenshots}
        showsHorizontalScrollIndicator={false}
      >
        {videos
          .sort((a, b) => a.id - b.id)
          .map((video, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.video_id}`)}
              >
                <Animated.Image
                  source={{
                    uri: `https://img.youtube.com/vi/${video.video_id}/0.jpg`,
                  }}
                  style={{
                    height: 135,
                    width: 240,
                    marginRight: index === videos.length - 1 ? 20 : 8,
                    marginLeft: index === 0 ? 20 : 0,
                    borderRadius: 8,
                  }}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={{ marginLeft: index === 0 ? 20 : 0, width: 240, fontWeight: 'bold' }}
              >
                {video.name}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginLeft: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  screenshotsContent: { flexDirection: 'row', gap: 10 },
  screenshots: {},
});
