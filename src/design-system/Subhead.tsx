import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";

interface SubheadProps {
  children: React.ReactNode;
  color?: keyof Theme["colors"]["text"];
}

export function Subhead({ color = "subtle", ...props }: SubheadProps) {
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
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
