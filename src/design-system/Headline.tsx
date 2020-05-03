import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface HeadlineProps {
  children: React.ReactNode;
  color?: keyof Theme["colors"]["text"];
}

export function Headline({ color = "default", ...props }: HeadlineProps) {
  const textStyle = StyleSheet.flatten([
    styles.text,
    {
      color: theme.colors.text[color],
    },
  ]);

  return <Text style={textStyle} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.m,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
