import React from "react";
import { View, StyleSheet } from "react-native";

// Simple implementation without dependencies
export default function TabBarBackground() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
        },
      ]}
    />
  );
}
