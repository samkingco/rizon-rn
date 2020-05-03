import React from "react";
import { Button } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MenuStackParamList } from "./MenuScreen";
import { BackgroundView } from "../design-system/BackgroundView";
import { ActionButton } from "../components/ActionButton";

type AboutScreenRouteProp = RouteProp<MenuStackParamList, "About">;
type AboutScreenNavigationProp = StackNavigationProp<
  MenuStackParamList,
  "About"
>;

type Props = {
  route: AboutScreenRouteProp;
  navigation: AboutScreenNavigationProp;
};

export function AboutScreen({ navigation }: Props) {
  return (
    <BackgroundView>
      <ActionButton label="←" onPress={() => navigation.goBack()} />
    </BackgroundView>
  );
}
