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
      return {
        ...state,
        current: action.payload,
      };
    }

    default:
      return state;
  }
}
