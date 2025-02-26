import React from "react";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

export function IconSymbol({ name, size, color }) {
  // Handle Material Icons
  if (MaterialIcons.glyphMap[name]) {
    return <MaterialIcons name={name} size={size} color={color} />;
  }

  // Handle FontAwesome5
  if (FontAwesome5.glyphMap[name]) {
    return <FontAwesome5 name={name} size={size} color={color} />;
  }

  // For Ionicons (iOS-style icons)
  if (name.includes(".fill") || name.includes(".circle")) {
    // Convert SF Symbols naming to Ionicons naming
    const ionName = name
      .replace(".fill", "")
      .replace(".circle", "")
      .replace("house", "home")
      .replace("dollarsign", "cash")
      .replace("chart.pie", "pie-chart")
      .replace("message", "chatbubble");

    return <Ionicons name={`ios-${ionName}`} size={size} color={color} />;
  }

  // Default fallback
  return <MaterialIcons name="help" size={size} color={color} />;
}
