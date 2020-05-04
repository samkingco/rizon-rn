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
  start: number;
  end: number;
}

export interface SunTimings {
  twilightAM: Time;
  goldenHourAM: Time;
  sunrise: Time;
  solarNoon: number;
  sunset: Time;
  goldenHourPM: Time;
  twilightPM: Time;
}

export function getSunTimings(
  timestamp: number,
  latitude = 51.24,
  longitude = -0.5821,
): SunTimings {
  const date = new Date(timestamp);
  const times = SunCalc.getTimes(date, latitude, longitude) as CustomTimes;

  return {
    twilightAM: {
      start: times.RZTwilightAMStart.getTime(),
      end: times.RZTwilightAMEnd.getTime(),
    },
    goldenHourAM: {
      start: times.RZGoldenHourAMStart.getTime(),
      end: times.RZGoldenHourAMEnd.getTime(),
    },
    sunrise: {
      start: times.sunrise.getTime(),
      end: times.sunriseEnd.getTime(),
    },
    solarNoon: times.solarNoon.getTime(),
    sunset: {
      start: times.sunsetStart.getTime(),
      end: times.sunset.getTime(),
    },
    goldenHourPM: {
      start: times.RZGoldenHourPMStart.getTime(),
      end: times.RZGoldenHourPMEnd.getTime(),
    },
    twilightPM: {
      start: times.RZTwilightPMStart.getTime(),
      end: times.RZTwilightPMEnd.getTime(),
    },
  };
}

// export function useSunTimings(
//   date: number,
//   latitude: number,
//   longitude: number,
// ): SunTimings {
//   const sunTimings = getSunTimings(date, latitude, longitude);
//   const [timings, setTimings] = useState<SunTimings>(sunTimings);

//   useEffect(() => {
//     setTimings(getSunTimings(date, latitude, longitude));
//   }, [date, latitude, longitude]);

//   return timings;
// }
