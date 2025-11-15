import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { GlassContainer } from 'expo-glass-effect';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ControlButton } from './Control';

const { width, height } = Dimensions.get('screen');

const SPRING_CONFIG = { damping: 30, stiffness: 160 };
const VIDEO_SOURCE = 'https://www.pexels.com/download/video/852435/';
const DETACH_TRESHOLD = 50;
const SNAP_X = -130;
const SNAP_Y = 360;
const SNAP_CONDITION_X = -50;
const SNAP_CONDITION_Y = 150;

export const PlayerContainer = () => {
  // -----------------------------
  // VIDEO PLAYER
  // -----------------------------
  const player = useVideoPlayer(VIDEO_SOURCE, p => {
    p.loop = true;
    p.play();
  });

  useEvent(player, 'playingChange', { isPlaying: player.playing });

  // -----------------------------
  // GESTURE VALUES
  // -----------------------------
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // -----------------------------
  // DRAG GESTURE
  // -----------------------------
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      const shouldSnapBottomLeft =
        translateX.value < SNAP_CONDITION_X && translateY.value > SNAP_CONDITION_Y;

      translateX.value = withSpring(
        shouldSnapBottomLeft ? SNAP_X : 0,
        SPRING_CONFIG
      );
      translateY.value = withSpring(
        shouldSnapBottomLeft ? SNAP_Y : 0,
        SPRING_CONFIG
      );
    });

  // -----------------------------
  // ANIMATED STYLES
  // -----------------------------
  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const prevButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          Math.abs(translateX.value) > DETACH_TRESHOLD
            ? withSpring(DETACH_TRESHOLD, SPRING_CONFIG)
            : withSpring(0, SPRING_CONFIG),
      },
    ],
  }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          Math.abs(translateX.value) > DETACH_TRESHOLD
            ? withSpring(-DETACH_TRESHOLD, SPRING_CONFIG)
            : withSpring(0, SPRING_CONFIG),
      },
    ],
  }));

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <View style={styles.container}>
      <GlassContainer spacing={30} style={styles.controlsContainer}>
        <Animated.View style={prevButtonStyle}>
          <ControlButton
            size={80}
            icon="10.arrow.trianglehead.counterclockwise"
            rotate
          />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={playButtonStyle}>
            <ControlButton size={100} icon="pause.fill" rotate/>
          </Animated.View>
        </GestureDetector>

        <Animated.View style={nextButtonStyle}>
          <ControlButton
            size={80}
            icon="30.arrow.trianglehead.clockwise"
            rotate
          />
        </Animated.View>
      </GlassContainer>

      <VideoView
        style={styles.video}
        contentFit="cover"
        player={player}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </View>
  );
};

// ------------------------------------------------------
// STYLES
// ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: height,
    height: width,
    transform: [{ rotate: '90deg' }],
    backgroundColor: 'black',
  },
});