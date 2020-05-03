import React from "react";
import { View, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface SafeAreaViewProps {
  children: React.ReactNode;
  backgroundColor?: keyof Theme["colors"]["background"];
}

export function BackgroundView({
  backgroundColor = "black",
  ...props
}: SafeAreaViewProps) {
  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: theme.colors.background[backgroundColor],
    },
  ]);

  return <View style={containerStyle} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
