import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface BodyProps {
  children: React.ReactNode;
  color?: keyof Theme["colors"]["text"];
}

export function Body({ color = "subtle", ...props }: BodyProps) {
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
    fontFamily: theme.fonts.normal,
    fontSize: theme.fontSizes.m,
  },
});
