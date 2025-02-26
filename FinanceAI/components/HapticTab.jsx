import React from "react";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";

export function HapticTab(props) {
  const { onPress, ...otherProps } = props;

  const handlePress = (e) => {
    // Provide haptic feedback when tab is pressed
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress(e);
    }
  };

  return <Pressable onPress={handlePress} {...otherProps} />;
}
