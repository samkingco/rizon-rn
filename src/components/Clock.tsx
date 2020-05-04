import React, { useState } from "react";
import { View, StyleSheet, Dimensions, PanResponder } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { SunTimings } from "../hooks/useSunTimings";
import { theme } from "../theme";

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

function cartesianToPolar(x: number, y: number, radius: number) {
  if (x === 0) {
    return y > radius ? 0 : 180;
  } else if (y === 0) {
    return x > radius ? 90 : 270;
  } else {
    return (
      Math.round((Math.atan((y - radius) / (x - radius)) * 180) / Math.PI) +
      (x > radius ? 90 : 270)
    );
  }
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
const size = width - 48;
const cx = size / 2;
const cy = size / 2;

interface ClockProps {
  sunTimings: SunTimings;
}

export function Clock(props: ClockProps) {
  const strokeWidth = 2;
  const r = (size - strokeWidth) / 2;

  const currentTime = useCurrentTime({ updateFrequency: 1000 });
  const angleForNow = getAngleForTime(currentTime);
  const [rotationAngle, setRotationAngle] = useState(angleForNow);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let a = cartesianToPolar(gs.moveX - cx, gs.moveY - cy, r);

        // if (a <= 0) {
        //   setRotationAngle(0);
        // } else if (a >= 359) {
        //   setRotationAngle(359);
        // } else {
        // }
        setRotationAngle(a);
      },
    }),
  ).current;

  const { sunTimings } = props;

  const twilightArcStart = getAngleForTime(sunTimings.twilightAM.start);
  const twilightArcEnd = getAngleForTime(sunTimings.twilightPM.end);
  const twilightArc = describeArc(cx, cy, r, twilightArcStart, twilightArcEnd);

  const goldenHourArcStart = getAngleForTime(sunTimings.goldenHourAM.start);
  const goldenHourArcEnd = getAngleForTime(sunTimings.goldenHourPM.end);
  const goldenHourArc = describeArc(
    cx,
    cy,
    r,
    goldenHourArcStart,
    goldenHourArcEnd,
  );

  const daylightArcStart = getAngleForTime(sunTimings.goldenHourAM.end);
  const daylightArcEnd = getAngleForTime(sunTimings.goldenHourPM.start);
  const daylightArc = describeArc(cx, cy, r, daylightArcStart, daylightArcEnd);

  const numOfPips = 24 * 8;
  const pipAngles = Array.from(new Array(numOfPips)).map(
    (_, index) => (360 / numOfPips) * index,
  );

  const closestPipToNow = pipAngles.reduce(function (prev, curr) {
    return Math.abs(curr - angleForNow) < Math.abs(prev - angleForNow)
      ? curr
      : prev;
  });

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      <Svg width={size} height={size}>
        {pipAngles.map((angle, index) => (
          <Line
            key={angle}
            fill="none"
            stroke={
              index === pipAngles.indexOf(closestPipToNow)
                ? theme.colors.clock.daylight
                : theme.colors.clock.background
            }
            strokeWidth={2}
            x1={cx}
            y1="6"
            x2={cx}
            y2="10"
            transform={{ rotation: angle, originX: cx, originY: cy }}
          />
        ))}
        <Line
          x1={cx}
          y1="16"
          x2={cx}
          y2={cy}
          strokeWidth={2}
          stroke={theme.colors.clock.daylight}
          transform={{ rotation: rotationAngle, originX: cx, originY: cy }}
        />
        <Circle
          fill="none"
          stroke={theme.colors.clock.background}
          strokeWidth={strokeWidth}
          cx={cx}
          cy={cy}
          r={r}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: size,
    height: size,
    position: "relative",
  },
  pipWrapper: {
    transform: [
      { rotate: "-90deg" },
      { translateX: cx * -1 },
      { translateY: cy * -1 },
    ],
  },
  pip: {
    width: 4,
    marginLeft: -2,
    height: 2,
    marginTop: -1,
    backgroundColor: "rgba(255,255,255,0.16)",
    position: "absolute",
  },
});
