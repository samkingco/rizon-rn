import React from "react";
import { StyleSheet, View } from "react-native";

interface ContentBlockProps {
  children: React.ReactNode;
}

export function ContentBlock({ ...props }: ContentBlockProps) {
  return <View style={styles.container} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
