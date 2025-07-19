import { PlayIcon } from 'lucide-react-native';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { AppText } from './Themed';

type Props = {
  videos: { id: number; video_id: string; name: string }[];
};

const WIDTH = 240; // Width of each video thumbnail
const HEIGHT = 135; // Height of each video thumbnail
const ICON_SIZE = 50; // Size of the play button icon bg

export const VideosSection = ({ videos }: Props) => {
  return (
    <View style={{ marginTop: 20 }}>
      <AppText style={styles.subtitle}>Videos</AppText>
      <ScrollView
        horizontal
        contentContainerStyle={styles.screenshotsContent}
        style={styles.screenshots}
        showsHorizontalScrollIndicator={false}
      >
        {videos
          .sort((a, b) => a.id - b.id)
          .map((video, index) => (
            <View
              key={index}
              style={{
                position: 'relative',
                marginRight: index === videos.length - 1 ? 20 : 8,
                marginLeft: index === 0 ? 20 : 0,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://www.youtube.com/watch?v=${video.video_id}`,
                  )
                }
              >
                <Animated.Image
                  source={{
                    uri: `https://img.youtube.com/vi/${video.video_id}/0.jpg`,
                  }}
                  style={{
                    height: HEIGHT,
                    width: WIDTH,

                    borderRadius: 8,
                  }}
                />
              </TouchableOpacity>
              <AppText
                numberOfLines={1}
                style={{
                  marginLeft: index === 0 ? 20 : 0,
                  width: 240,
                  fontWeight: 'bold',
                }}
              >
                {video.name}
              </AppText>
              <View style={styles.playBtnBG}>
                <PlayIcon
                  size={24}
                  color={'#fff'}
                  fill="#fff"
                  style={{}}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.youtube.com/watch?v=${video.video_id}`,
                    )
                  }
                />
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  playBtnBG: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'absolute',
    top: HEIGHT / 2 - ICON_SIZE / 2,
    left: WIDTH / 2 - ICON_SIZE / 2,
    backgroundColor: 'rgba(65, 65, 65, 0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  screenshotsContent: { flexDirection: 'row', gap: 10 },
  screenshots: {},
});
