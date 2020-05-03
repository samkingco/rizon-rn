import React from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { format, differenceInMilliseconds } from "date-fns";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "../design-system/SafeAreaView";
import { ContentBlock } from "../design-system/ContentBlock";
import { Title } from "../design-system/Title";
import { Headline } from "../design-system/Headline";
import { Subhead } from "../design-system/Subhead";
import { MenuButton } from "../components/MenuButton";
import { getSunTimings } from "../hooks/useSunTimings";
import { useGeolocation } from "../hooks/useGeolocation";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

interface TimeRow {
  name: string;
  start: Date;
  end?: Date;
}

export function HomeScreen({ navigation }: Props) {
  const [position, isLoadingPosition, positionError] = useGeolocation();

  const times = getSunTimings(
    new Date(),
    position.latitude,
    position.longitude,
  );

  const goldenHourLength = differenceInMilliseconds(
    times.goldenHourAM.end,
    times.goldenHourAM.start,
  );

  const formattedGoldenHourLength = format(goldenHourLength, "h'H' M'M'");

  const AMTimes: TimeRow[] = [
    {
      name: "Twilight",
      ...times.twilightAM,
    },
    {
      name: "Sunrise",
      start: times.sunrise.start,
    },
    {
      name: "Golden hour",
      ...times.goldenHourAM,
    },
  ];

  const PMTimes: TimeRow[] = [
    {
      name: "Golden hour",
      ...times.goldenHourPM,
    },
    {
      name: "Sunset",
      start: times.sunset.end,
    },
    {
      name: "Twilight",
      ...times.twilightPM,
    },
  ];

  return (
    <SafeAreaView>
      <ContentBlock>
        <Title>{position.name}</Title>
        <Subhead>
          {positionError
            ? "Couldn't get your location"
            : `${position.latitude.toFixed(2)}°N ${position.longitude.toFixed(
                2,
              )}°W`}
        </Subhead>
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
        <Subhead>
          {format(times.goldenHourAM.start, "HH:mm")} –{" "}
          {format(times.goldenHourAM.end, "HH:mm")}
        </Subhead>
        <Subhead>{formattedGoldenHourLength}</Subhead>
      </ContentBlock>
      <ContentBlock>
        {AMTimes.map((time) => (
          <React.Fragment key={`AM_${time.name}`}>
            <Headline>{time.name}</Headline>
            <Subhead>
              {format(time.start, "HH:mm")}
              {time.end ? ` – ${format(time.end, "HH:mm")}` : null}
            </Subhead>
          </React.Fragment>
        ))}
        {PMTimes.map((time) => (
          <React.Fragment key={`PM_${time.name}`}>
            <Headline>{time.name}</Headline>
            <Subhead>
              {format(time.start, "HH:mm")}
              {time.end ? ` – ${format(time.end, "HH:mm")}` : null}
            </Subhead>
          </React.Fragment>
        ))}
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
