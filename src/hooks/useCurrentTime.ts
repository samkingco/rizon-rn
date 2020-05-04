import { useEffect, useState } from "react";

interface Options {
  updateFrequency?: number;
}

export function useCurrentTime(options?: Options) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(Date.now());
    }, (options && options.updateFrequency) || 60000);
  }, [currentTime]);

  return currentTime;
}
