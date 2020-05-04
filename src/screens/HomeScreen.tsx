import React from "react";
import { useSelector } from "react-redux";
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
import { sunSettingsSelectors } from "../store/sun-settings";
import { savedLocationSelectors } from "../store/saved-locations";
import { Clock } from "../components/Clock";
import { ScrollView } from "react-native-gesture-handler";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

interface TimeRow {
  name: string;
  start: number;
  end?: number;
}

export function HomeScreen({ navigation }: Props) {
  const { liveLocation } = useGeolocation();

  const {
    useLiveLocation,
    selectedSavedLocationId,
    selectedDateTimestamp,
  } = useSelector(sunSettingsSelectors.getSettings);

  const selectedSavedLocation = useSelector((s) =>
    savedLocationSelectors.byId(s, selectedSavedLocationId || ""),
  );

  const location =
    !useLiveLocation && selectedSavedLocation
      ? selectedSavedLocation
      : liveLocation;

  const sunTimings = getSunTimings(
    selectedDateTimestamp,
    location.latitude,
    location.longitude,
  );

  // const timeFormat = "yyyy-MM-dd'T'HH:mm xxx";
  const timeFormat = "HH:mm";

  const currentTime = new Date();

  const goldenHourLength = differenceInMilliseconds(
    sunTimings.goldenHourAM.end,
    sunTimings.goldenHourAM.start,
  );

  const formattedGoldenHourLength = format(goldenHourLength, "h'H' M'M'");

  const AMTimes: TimeRow[] = [
    {
      name: "Twilight",
      ...sunTimings.twilightAM,
    },
    {
      name: "Sunrise",
      start: sunTimings.sunrise.start,
    },
    {
      name: "Golden hour",
      ...sunTimings.goldenHourAM,
    },
  ];

  const PMTimes: TimeRow[] = [
    {
      name: "Golden hour",
      ...sunTimings.goldenHourPM,
    },
    {
      name: "Sunset",
      start: sunTimings.sunset.end,
    },
    {
      name: "Twilight",
      ...sunTimings.twilightPM,
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
        <ContentBlock>
          <Title>{location.name}</Title>
          <Subhead>
            {`${location.latitude.toFixed(2)}°N ${location.longitude.toFixed(
              2,
            )}°W`}
          </Subhead>
        </ContentBlock>
        <ContentBlock>
          <View style={styles.timeRow}>
            <Headline>{format(currentTime, "cccc")}</Headline>
            <Headline>{format(currentTime, timeFormat)}</Headline>
          </View>
          <View style={styles.timeRow}>
            <Subhead>{format(currentTime, "dd MMM, yyyy")}</Subhead>
            <Subhead>+3hr 13m</Subhead>
          </View>
        </ContentBlock>
        <ContentBlock>
          <Clock sunTimings={sunTimings} />
        </ContentBlock>
        <ContentBlock>
          <Headline color="goldenHour">Golden hour</Headline>
          <Subhead>
            {format(sunTimings.goldenHourAM.start, timeFormat)} –{" "}
            {format(sunTimings.goldenHourAM.end, timeFormat)}
          </Subhead>
          <Subhead>{formattedGoldenHourLength}</Subhead>
        </ContentBlock>
        <ContentBlock>
          {AMTimes.map((time) => (
            <React.Fragment key={`AM_${time.name}`}>
              <Headline>{time.name}</Headline>
              <Subhead>
                {format(time.start, timeFormat)}
                {time.end ? ` – ${format(time.end, timeFormat)}` : null}
              </Subhead>
            </React.Fragment>
          ))}
          {PMTimes.map((time) => (
            <React.Fragment key={`PM_${time.name}`}>
              <Headline>{time.name}</Headline>
              <Subhead>
                {format(time.start, timeFormat)}
                {time.end ? ` – ${format(time.end, timeFormat)}` : null}
              </Subhead>
            </React.Fragment>
          ))}
        </ContentBlock>
      </ScrollView>
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
