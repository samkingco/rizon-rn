import React from 'react';
import { Button } from 'react-native';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import { RootStackParamList } from 'src/App';
import { AboutScreen } from './AboutScreen';

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

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;
type MenuScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Menu'>,
  StackNavigationProp<MenuStackParamList, 'Menu'>
>;

type Props = {
  route: MenuScreenRouteProp;
  navigation: MenuScreenNavigationProp;
};

function MenuScreenComponent({ navigation }: Props) {
  return (
    <>
      <Button
        title="Go to about"
        onPress={() => navigation.navigate('About')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </>
  );
}

export function MenuScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerStatusBarHeight: 0,
      }}>
      <Stack.Screen name="Menu" component={MenuScreenComponent} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
