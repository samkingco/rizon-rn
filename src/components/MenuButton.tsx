import React from "react";
import { ActionButton, ActionButtonProps } from "./ActionButton";

export function MenuButton(props: ActionButtonProps) {
  return <ActionButton backgroundColor="accent" {...props} />;
}
