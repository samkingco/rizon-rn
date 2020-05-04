import React from "react";
import { Provider } from "react-redux";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { HomeScreen } from "./screens/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { store } from "./store";

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator
          initialRouteName="Home"
          headerMode="screen"
          screenOptions={{
            gestureEnabled: true,
            cardOverlayEnabled: true,
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ header: () => null }}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              ...TransitionPresets.ModalPresentationIOS,
              header: () => null,
              headerStatusBarHeight: 0,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
