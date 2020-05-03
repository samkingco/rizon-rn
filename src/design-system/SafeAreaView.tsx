import React from "react";
import { SafeAreaView as RNSafeAreaView, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface SafeAreaViewProps {
  children: React.ReactNode;
  backgroundColor?: keyof Theme["colors"]["background"];
}

export function SafeAreaView({
  backgroundColor = "black",
  ...props
}: SafeAreaViewProps) {
  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: theme.colors.background[backgroundColor],
    },
  ]);

  return <RNSafeAreaView style={containerStyle} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
