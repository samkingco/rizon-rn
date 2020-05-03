import { useState, useEffect } from "react";
import SunCalc from "suncalc";

SunCalc.addTime(-4, "RZGoldenHourAMStart", "RZGoldenHourPMEnd");
SunCalc.addTime(6, "RZGoldenHourAMEnd", "RZGoldenHourPMStart");

SunCalc.addTime(-12, "RZTwilightAMStart", "RZTwilightPMEnd");
SunCalc.addTime(-4, "RZTwilightAMEnd", "RZTwilightPMStart");

interface CustomTimes extends SunCalc.GetTimesResult {
  RZGoldenHourAMStart: Date;
  RZGoldenHourPMEnd: Date;
  RZGoldenHourAMEnd: Date;
  RZGoldenHourPMStart: Date;
  RZTwilightAMStart: Date;
  RZTwilightPMEnd: Date;
  RZTwilightAMEnd: Date;
  RZTwilightPMStart: Date;
}

interface Time {
  start: Date;
  end: Date;
}

interface Timings {
  twilightAM: Time;
  goldenHourAM: Time;
  sunrise: Time;
  solarNoon: Date;
  sunset: Time;
  goldenHourPM: Time;
  twilightPM: Time;
}

export function getSunTimings(
  date = new Date(),
  latitude = 51.24,
  longitude = -0.5821,
): Timings {
  const times = SunCalc.getTimes(date, latitude, longitude) as CustomTimes;

  return {
    twilightAM: {
      start: times.RZTwilightAMStart,
      end: times.RZTwilightAMEnd,
    },
    goldenHourAM: {
      start: times.RZGoldenHourAMStart,
      end: times.RZGoldenHourAMEnd,
    },
    sunrise: {
      start: times.sunrise,
      end: times.sunriseEnd,
    },
    solarNoon: times.solarNoon,
    sunset: {
      start: times.sunsetStart,
      end: times.sunset,
    },
    goldenHourPM: {
      start: times.RZGoldenHourPMStart,
      end: times.RZGoldenHourPMEnd,
    },
    twilightPM: {
      start: times.RZTwilightPMStart,
      end: times.RZTwilightPMEnd,
    },
  };
}

export function useSunTimings(
  date: Date,
  latitude: number,
  longitude: number,
): Timings {
  const sunTimings = getSunTimings(date, latitude, longitude);
  const [timings, setTimings] = useState<Timings>(sunTimings);

  useEffect(() => {
    setTimings(getSunTimings(date, latitude, longitude));
  }, [date, latitude, longitude]);

  return timings;
}
