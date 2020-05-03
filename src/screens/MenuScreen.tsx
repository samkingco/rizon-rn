import React from "react";
import { Button, View } from "react-native";
import {
  RouteProp,
  CompositeNavigationProp,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { AboutScreen } from "./AboutScreen";
import { BackgroundView } from "../design-system/BackgroundView";
import { ActionButton } from "../components/ActionButton";

export type MenuStackParamList = {
  Menu: undefined;
  ChangeLocation: undefined;
  ChangeDate: undefined;
  Reminders: undefined;
  About: undefined;
  Glossary: undefined;
  HelpAndSupport: undefined;
  PrivacyPolicy: undefined;
  RateRizon: undefined;
};

const Stack = createStackNavigator<MenuStackParamList>();

type MenuScreenRouteProp = RouteProp<RootStackParamList, "Menu">;
type MenuScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "Menu">,
  StackNavigationProp<MenuStackParamList, "Menu">
>;

type Props = {
  route: MenuScreenRouteProp;
  navigation: MenuScreenNavigationProp;
};

function MenuScreenComponent({ navigation }: Props) {
  return (
    <BackgroundView>
      <Button
        title="Go to about"
        onPress={() => navigation.navigate("About")}
      />
      <ActionButton
        label="✕"
        backgroundColor="white"
        onPress={() => navigation.goBack()}
      />
    </BackgroundView>
  );
}

export function MenuScreen() {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStatusBarHeight: 0,
          headerStyle: {
            height: 0,
          },
          header: () => null,
        }}>
        <Stack.Screen name="Menu" component={MenuScreenComponent} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </>
  );
}
