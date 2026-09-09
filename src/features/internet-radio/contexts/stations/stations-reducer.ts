import type { StationsAction, StationsStore } from "./stations-state";

export function stationsReducer(
  state: StationsStore,
  action: StationsAction,
): StationsStore {
  switch (action.type) {
    case "stationsLoaded":
      return {
        ...state,
        stations: action.payload,
      };

    case "currentChanged": {
      const currentStation = action.payload.station;
      return {
        ...state,
        current: action.payload,
        selected: currentStation?.id ? currentStation : state.selected,
      };
    }

    case "stationSelected":
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
}
