import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, PanResponder, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { SunTimings } from "../hooks/useSunTimings";
import { theme } from "../theme";
import { Headline } from "../design-system/Headline";

function radiansToDegrees(radians: number) {
  return (
    ((radians > 0 ? radians : 2 * Math.PI + radians) * 360) / (2 * Math.PI)
  );
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function getAngleForTime(timestamp: number) {
  const secondsInADay = 24 * 60 * 60;
  const date = new Date(timestamp);
  const hours = date.getHours() * 60 * 60;
  const minutes = date.getMinutes() * 60;
  const seconds = date.getSeconds();
  const totalSeconds = hours + minutes + seconds;
  const fractionSeconds = totalSeconds / secondsInADay;
  const angleOfTime = 360 * fractionSeconds;

  // compensate for midnight being at the bottom of the circle, not the top
  return angleOfTime - 180;
}

const { width } = Dimensions.get("window");
const size = width - 32;
const centerX = size / 2;
const centerY = size / 2;

interface ClockProps {
  sunTimings: SunTimings;
}

function getRotationAngle(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
) {
  return radiansToDegrees(Math.atan2(x - centerX, y - centerY));
}

export function Clock(props: ClockProps) {
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;

  // const currentTime = useCurrentTime({ updateFrequency: 1000 });
  // const angleForNow = getAngleForTime(currentTime);
  const angleForNow = getAngleForTime(Date.now());

  const clockViewRef = useRef<View>(null);
  const [clockPos, setClockPos] = useState({ centerX: 0, centerY: 0 });

  const rotationOffset = useRef(0);
  const lastRotationOffset = useRef(0);

  const lastCoords = useRef({ x: 0, y: 0 });
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });

  const startDeg = getRotationAngle(
    lastCoords.current.x,
    lastCoords.current.y,
    clockPos.centerX,
    clockPos.centerY,
  );

  const currentDeg = getRotationAngle(
    currentCoords.x,
    currentCoords.y,
    clockPos.centerX,
    clockPos.centerY,
  );

  rotationOffset.current = lastRotationOffset.current + (startDeg - currentDeg);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (_, gesture) => {
        lastCoords.current = { x: gesture.moveX, y: gesture.moveY };
      },
      onPanResponderMove: (_, gesture) => {
        setCurrentCoords({ x: gesture.moveX, y: gesture.moveY });
      },
      onPanResponderRelease: () => {
        lastRotationOffset.current = rotationOffset.current;
      },
    }),
  ).current;

  useEffect(() => {
    if (!clockViewRef.current) {
      return;
    }

    clockViewRef.current.measure((x, y, width, height, pageX, pageY) => {
      setClockPos({
        centerX: pageX + width / 2,
        centerY: pageY + height / 2,
      });
    });
  }, [clockViewRef.current]);

  const { sunTimings } = props;

  const twilightArcStart = getAngleForTime(sunTimings.twilightAM.start);
  const twilightArcEnd = getAngleForTime(sunTimings.twilightPM.end);
  const twilightArc = describeArc(
    centerX,
    centerY,
    radius,
    twilightArcStart,
    twilightArcEnd,
  );

  const goldenHourArcStart = getAngleForTime(sunTimings.goldenHourAM.start);
  const goldenHourArcEnd = getAngleForTime(sunTimings.goldenHourPM.end);
  const goldenHourArc = describeArc(
    centerX,
    centerY,
    radius,
    goldenHourArcStart,
    goldenHourArcEnd,
  );

  const daylightArcStart = getAngleForTime(sunTimings.goldenHourAM.end);
  const daylightArcEnd = getAngleForTime(sunTimings.goldenHourPM.start);
  const daylightArc = describeArc(
    centerX,
    centerY,
    radius,
    daylightArcStart,
    daylightArcEnd,
  );

  const numOfPips = 24 * 6;
  const pipAngles = Array.from(new Array(numOfPips)).map(
    (_, index) => (360 / numOfPips) * index - 180,
  );

  const closestPipToNow = pipAngles.reduce(function (prev, curr) {
    return Math.abs(curr - angleForNow) < Math.abs(prev - angleForNow)
      ? curr
      : prev;
  });

  return (
    <View ref={clockViewRef} {...panResponder.panHandlers}>
      <View style={[styles.timeHandWrapper]}>
        <Svg
          width={size}
          height={size}
          style={{ transform: [{ rotate: `${rotationOffset.current}deg` }] }}>
          <Line
            x1={centerX}
            y1="16"
            x2={centerX}
            y2={centerY}
            strokeWidth={2}
            stroke={theme.colors.clock.daylight}
            transform={{
              rotation: angleForNow,
              originX: centerX,
              originY: centerY,
            }}
          />
        </Svg>
      </View>
      <Svg width={size} height={size}>
        {pipAngles.map((pipAngle, index) => (
          <Line
            key={pipAngle}
            fill="none"
            stroke={
              index === pipAngles.indexOf(closestPipToNow)
                ? theme.colors.clock.daylight
                : theme.colors.clock.background
            }
            strokeWidth={2}
            x1={centerX}
            y1="6"
            x2={centerX}
            y2="10"
            transform={{
              rotation: pipAngle,
              originX: centerX,
              originY: centerY,
            }}
          />
        ))}
        <Circle
          fill="none"
          stroke={theme.colors.clock.background}
          strokeWidth={strokeWidth}
          cx={centerX}
          cy={centerY}
          r={radius}
        />
        <Path
          fill="none"
          stroke={theme.colors.clock.twilight}
          strokeWidth={strokeWidth}
          d={twilightArc}
        />
        <Path
          fill="none"
          stroke={theme.colors.clock.goldenHour}
          strokeWidth={strokeWidth}
          d={goldenHourArc}
        />
        <Path
          fill="none"
          stroke={theme.colors.clock.daylight}
          strokeWidth={strokeWidth}
          d={daylightArc}
        />
      </Svg>
      <Headline>{rotationOffset.current}</Headline>
    </View>
  );
}

const styles = StyleSheet.create({
  timeHandWrapper: {
    position: "absolute",
  },
});
