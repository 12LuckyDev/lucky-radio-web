import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useState } from "preact/hooks";

type ModuleName = "i-radio";
type AppState = {
  isLoading: boolean;
  setModuleAsReady: (name: ModuleName) => void;
};

const initialState: AppState = {
  isLoading: true,
  setModuleAsReady: () => {},
};

export const AppContext = createContext<AppState>(initialState);

export function AppProvider({ children }: { children: ComponentChildren }) {
  const [internetRadioReady, setInternetRadioReady] = useState<boolean>(false);

  const setModuleAsReady = (name: ModuleName) => {
    if (name === "i-radio") {
      setInternetRadioReady(true);
    }
  };

  return (
    <AppContext.Provider
      value={{ isLoading: !internetRadioReady, setModuleAsReady }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  return context;
}
