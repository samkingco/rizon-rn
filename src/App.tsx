import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            ...TransitionPresets.ModalPresentationIOS,
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
