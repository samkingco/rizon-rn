import React from "react";
import { Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "../design-system/SafeAreaView";
import { ContentBlock } from "../design-system/ContentBlock";
import { Title } from "../design-system/Title";
import { Headline } from "../design-system/Headline";
import { Subhead } from "../design-system/Subhead";
import { MenuButton } from "../components/MenuButton";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView>
      <ContentBlock>
        <Title>San Francisco</Title>
        <Subhead>37.78°N 122.41°W</Subhead>
      </ContentBlock>
      <ContentBlock>
        <View style={styles.timeRow}>
          <Headline>Thursday</Headline>
          <Headline>19:21</Headline>
        </View>
        <View style={styles.timeRow}>
          <Subhead>24 Jun, 2018</Subhead>
          <Subhead>+3hr 13m</Subhead>
        </View>
      </ContentBlock>
      <ContentBlock>
        <Headline color="accent">Golden hour</Headline>
        <Subhead>6:45pm – 7:52pm</Subhead>
        <Subhead>1hr 7m</Subhead>
      </ContentBlock>
      <MenuButton label="⌘" onPress={() => navigation.navigate("Menu")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
