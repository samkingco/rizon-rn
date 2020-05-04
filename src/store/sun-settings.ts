import { createSlice } from "@reduxjs/toolkit";
import { Dispatch, AppState } from "./";

interface SunSettingsState {
  useLiveLocation: boolean;
  selectedSavedLocationId: string | undefined;
  selectedDateTimestamp: number;
}

const initialState: SunSettingsState = {
  useLiveLocation: false,
  selectedSavedLocationId: "1",
  selectedDateTimestamp: Date.now(),
};

export const { actions, reducer } = createSlice({
  name: "sunSettings",
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

function getSettings(state: AppState): SunSettingsState {
  return state.sunSettings;
}

export const sunSettingsSelectors = {
  getSettings,
};
