import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface TitleProps {
  children: React.ReactNode;
  color?: keyof Theme["colors"]["text"];
}

export function Title({ color = "default", ...props }: TitleProps) {
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
    fontSize: theme.fontSizes.l,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
