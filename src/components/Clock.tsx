import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, PanResponder } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { SunTimings } from "../hooks/useSunTimings";
import { theme } from "../theme";

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

enum ClockStatus {
  IDLE = "IDLE",
  ROTATING = "ROTATING",
}

export function Clock(props: ClockProps) {
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;

  const currentTime = useCurrentTime({ updateFrequency: 1000 });
  const angleForNow = getAngleForTime(currentTime);

  const clockViewRef = useRef<View>(null);
  const [clockPos, setClockPos] = useState({ x: 0, y: 0 });
  const [rotationStatus, setRotationStatus] = useState(ClockStatus.IDLE);
  const [idleRotation, setIdleRotation] = useState(angleForNow);
  const [rotation, setRotation] = useState(angleForNow);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });

  const startDeg = radiansToDegrees(
    Math.atan2(startCoords.x - clockPos.x, startCoords.y - clockPos.y),
  );

  const currentDeg = radiansToDegrees(
    Math.atan2(currentCoords.x - clockPos.x, currentCoords.y - clockPos.y),
  );

  const degreesDifference = startDeg - currentDeg;

  useEffect(() => {
    setRotation(idleRotation + degreesDifference);
  }, [degreesDifference]);

  useEffect(() => {
    if (rotationStatus === ClockStatus.IDLE) {
      setIdleRotation(rotation);
    }
  }, [rotationStatus, rotation]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        setRotationStatus(ClockStatus.ROTATING);
        setStartCoords({ x: gestureState.x0, y: gestureState.y0 });
      },
      onPanResponderMove: (e, gestureState) => {
        setCurrentCoords({ x: gestureState.moveX, y: gestureState.moveY });
      },
      onPanResponderRelease: (e, gestureState) => {
        setRotationStatus(ClockStatus.IDLE);
      },
    }),
  ).current;

  useEffect(() => {
    if (!clockViewRef.current) {
      return;
    }

    clockViewRef.current.measure((x, y, width, height, pageX, pageY) => {
      setClockPos({
        x: pageX + width / 2,
        y: pageY + height / 2,
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
        <Line
          x1={centerX}
          y1="16"
          x2={centerX}
          y2={centerY}
          strokeWidth={2}
          stroke={theme.colors.clock.daylight}
          transform={{
            rotation,
            originX: centerX,
            originY: centerY,
          }}
        />
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
    </View>
  );
}
