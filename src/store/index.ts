import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { reducer as sunSettingsReducer } from "./sun-settings";
import { reducer as savedLocationsReducer } from "./saved-locations";

const rootReducer = combineReducers({
  sunSettings: sunSettingsReducer,
  savedLocations: savedLocationsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;
export type GetState = () => AppState;
