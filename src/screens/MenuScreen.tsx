import React from "react";
import { Button } from "react-native";
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
import { SafeAreaView } from "../design-system/SafeAreaView";
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
    <SafeAreaView>
      <Button
        title="Go to about"
        onPress={() => navigation.navigate("About")}
      />
    </SafeAreaView>
  );
}

export function MenuScreen() {
  const navigation = useNavigation();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStatusBarHeight: 0,
          header: () => null,
        }}>
        <Stack.Screen name="Menu" component={MenuScreenComponent} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
      <ActionButton label="←" onPress={() => navigation.navigate("Menu")} />
    </>
  );
}
