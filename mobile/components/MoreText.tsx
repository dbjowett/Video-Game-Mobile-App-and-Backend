import { useTheme } from '@/theme/theme-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppText } from './Themed';

export const MoreText = ({ text }: { text: string }) => {
  const startingHeight = 118;
  const [expander, setExpander] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(startingHeight);
  const animatedHeight = useRef(new Animated.Value(startingHeight)).current;

  const { colors } = useTheme();

  useEffect(() => {
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: expanded ? fullHeight : startingHeight,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const onTextLayout = (e: LayoutChangeEvent) => {
    let { height } = e.nativeEvent.layout;
    height = Math.floor(height) + 40;
    if (height > startingHeight) {
      setFullHeight(height);
      setExpander(true);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.viewPort, { height: animatedHeight }]}>
        <View style={styles.textBox} onLayout={(e) => onTextLayout(e)}>
          <AppText style={styles.text}>{text}</AppText>
        </View>
      </Animated.View>

      {expander && (
        <React.Fragment>
          {/* <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)', // Change this gradient to match BG
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
            ]}
            style={styles.gradient}
          /> */}
          <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
            <AppText style={[styles.readBtn, { color: colors.primary }]}>
              {expanded ? 'Read Less' : 'Read More'}
            </AppText>
          </TouchableWithoutFeedback>
        </React.Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPort: {
    flex: 1,
    overflow: 'hidden',
    top: 12,
    marginBottom: 20,
  },
  textBox: {
    color: 'black',
    flex: 1,
    position: 'absolute',
  },
  text: {
    alignSelf: 'flex-start',
    textAlign: 'justify',
    fontSize: 16,
  },
  gradient: {
    backgroundColor: 'transparent', // required for gradient
    height: 40,
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  readBtn: {
    flex: 1,
    alignSelf: 'flex-end',
  },
});
