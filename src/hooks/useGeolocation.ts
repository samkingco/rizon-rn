import { useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder-reborn";

interface GeolocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export const useGeolocation = (): {
  liveLocation: GeolocationData;
  isLoading: boolean;
  error: string | undefined;
} => {
  const notFoundName = "Unknown location";
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<GeolocationData>({
    name: notFoundName,
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (pos) => {
        let name = notFoundName;
        async function getGeocoderResult() {
          try {
            setIsLoading(true);
            setError(undefined);
            const results = await Geocoder.geocodePosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });

            if (results.length > 0 && results[0].locality) {
              name = results[0].locality;
            }
          } catch (error) {
            console.log("something blew up", error);
            setError(error.message);
          }

          setIsLoading(false);
          setPosition({
            name,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }

        if (pos.coords.latitude && pos.coords.longitude) {
          getGeocoderResult();
        }
      },
      (e) => setError(e.message),
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  return { liveLocation: position, isLoading, error };
};
