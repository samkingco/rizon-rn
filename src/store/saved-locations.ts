import { createSlice } from "@reduxjs/toolkit";
import { Dispatch, AppState } from "./";

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface SavedLocationsState {
  locations: {
    [id: string]: Location;
  };
}

const initialState: SavedLocationsState = {
  locations: {
    "1": {
      name: "Guildford",
      latitude: 51.239007,
      longitude: -0.580074,
    },
    "2": {
      name: "Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
    },
    "3": {
      name: "Reykjavik",
      latitude: 64.1466,
      longitude: -21.9426,
    },
  },
};

export const { actions, reducer } = createSlice({
  name: "savedLocations",
  initialState,
  reducers: {
    reset: () => initialState,
  },
});

export function reset() {
  return function (dispatch: Dispatch) {
    dispatch(actions.reset());
  };
}

function byId(state: AppState, locationId: string): Location | undefined {
  return state.savedLocations.locations[locationId];
}

function list(state: AppState): Location[] {
  const res = [];
  for (const locationId of Object.keys(state.savedLocations.locations)) {
    if (state.savedLocations.locations[locationId]) {
      const location = byId(state, locationId);
      if (location) {
        res.push(location);
      }
    }
  }
  return res;
}

export const savedLocationSelectors = {
  byId,
  list,
};
