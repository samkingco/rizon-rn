import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { theme, Theme } from "../theme";
import { Subhead } from "../design-system/Subhead";

export interface ActionButtonProps {
  label: string;
  backgroundColor?: keyof Theme["colors"]["background"];
  onPress: () => void;
}

export function ActionButton({
  backgroundColor = "goldenHour",
  ...props
}: ActionButtonProps) {
  const buttonStyles = StyleSheet.flatten([
    styles.button,
    { backgroundColor: theme.colors.background[backgroundColor] },
  ]);

  return (
    <TouchableOpacity style={buttonStyles} {...props}>
      <Subhead color={backgroundColor === "white" ? "goldenHour" : "default"}>
        {props.label}
      </Subhead>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    bottom: 40,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 48,
  },
});
