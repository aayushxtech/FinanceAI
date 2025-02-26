import { Animated, Easing } from "react-native";

/**
 * Creates a fade-in animation
 * @param {Animated.Value} animatedValue - The animated value to manipulate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const fadeIn = (animatedValue, duration = 500, callback = null) => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start(callback);
};

/**
 * Creates a fade-out animation
 * @param {Animated.Value} animatedValue - The animated value to manipulate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const fadeOut = (animatedValue, duration = 500, callback = null) => {
  Animated.timing(animatedValue, {
    toValue: 0,
    duration: duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start(callback);
};

/**
 * Creates a slide-in animation
 * @param {Animated.Value} animatedValue - The animated value to manipulate
 * @param {number} startValue - Starting position
 * @param {number} endValue - Ending position
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const slideIn = (
  animatedValue,
  startValue,
  endValue,
  duration = 500,
  callback = null
) => {
  animatedValue.setValue(startValue);
  Animated.timing(animatedValue, {
    toValue: endValue,
    duration: duration,
    useNativeDriver: true,
    easing: Easing.out(Easing.cubic),
  }).start(callback);
};

/**
 * Creates a pulse animation
 * @param {Animated.Value} animatedValue - The animated value to manipulate
 * @param {function} callback - Optional callback after animation completes
 */
export const pulse = (animatedValue, callback = null) => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.linear,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.linear,
    }),
  ]).start(callback);
};

/**
 * Creates a stagger animation for list items
 * @param {Array<Animated.Value>} animatedValues - Array of animated values to manipulate
 * @param {number} duration - Animation duration for each item in ms
 * @param {number} delay - Delay between each item animation in ms
 */
export const staggerFadeIn = (animatedValues, duration = 300, delay = 50) => {
  const animations = animatedValues.map((value, i) => {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      delay: i * delay,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  });

  Animated.stagger(delay, animations).start();
};
